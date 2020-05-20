import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import { useQuery } from "@apollo/react-hooks";
import { PARKING_SESSION_BY_ID_QUERY } from "../constants/Queries";
import lodash from "lodash";
import { VehicleLink } from "./VehicleLink";
import { dateDisplay } from "../helpers/componentHelpers";
import { Color } from "../constants";
import imageGetter from "../helpers/imageGetter";
import { BackgroundChange } from "./BackgroundChange";

const styles = stylesheet({
  sessionDisplay: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    $nest: {
      table: {
        marginBottom: "1em",
      },
      h4: {
        display: "inline-block",
        marginTop: 0,
        textDecoration: "underline",
      },
    },
  },
  captureImage: {
    position: "relative",
    $nest: {
      "&:hover": {
        cursor: "pointer",
      },
      img: {
        position: "absolute",
        top: "100%",
        left: 0,
        boxShadow: "0px 0px 4px 2px #666",
      },
    },
  },
  assignmentRow: {
    $nest: {
      "&:hover": {
        backgroundColor: Color.LIGHT_GREY,
      },
    },
  },
});

const CaptureImage = ({ image, text }) => {
  const [imageData, setImageData] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const onHover = () => {
    setShowImage(true);
    if (!imageData && !!image) {
      // fetch
      imageGetter(image)
        .then((response) => response.blob())
        .then((blob) => {
          setImageData(URL.createObjectURL(blob));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onMouseLeave = () => {
    setShowImage(false);
  };
  return (
    <div
      className={styles.captureImage}
      onMouseLeave={onMouseLeave}
      onMouseOver={onHover}
      style={{ textDecoration: !image ? "none" : "underline" }}
    >
      {!text ? <span style={{ color: Color.LIGHT_GREY }}>empty</span> : text}
      {showImage && !!imageData ? <img src={imageData}></img> : null}
    </div>
  );
};

const HIGHLIGHT_COLOR = "#ececec";

export const ParkingSessionDisplay = ({ session: { id } }) => {
  const { data, loading, error } = useQuery(PARKING_SESSION_BY_ID_QUERY, {
    variables: { id },
    pollInterval: 5000,
  });
  const [highlightedAssignment, setHighlightedAssignment] = useState(null);
  useEffect(() => {
    setHighlightedAssignment(null);
  }, [id]);
  if (loading || !data) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>ERROR: {error}</div>;
  }
  const session = data.session;
  const [start, end] = dateDisplay(
    lodash.get(session, "checkIn.time"),
    lodash.get(session, "checkOut.time")
  );
  return (
    <>
      <h3>{`Parking Session of ${session.vehicle.licensePlate}`}</h3>
      <div className={styles.sessionDisplay}>
        <div>
          <table>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Total</th>
                <th>Vehicle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <BackgroundChange key={session.id} watched={start}>
                    <CaptureImage
                      key={session.id}
                      text={start}
                      image={lodash.get(session, "checkIn.imagePaths.0", null)}
                    />
                  </BackgroundChange>
                </td>
                <td>
                  <BackgroundChange key={session.id} watched={end}>
                    <CaptureImage
                      key={session.id}
                      text={end}
                      image={lodash.get(session, "checkOut.imagePaths.0", null)}
                    />
                  </BackgroundChange>
                </td>
                <td>
                  <BackgroundChange key={session.id} watched={session.finalFee}>
                    {session.finalFee / 100}
                  </BackgroundChange>
                </td>
                <td>
                  <VehicleLink vehicle={session.vehicle} />
                </td>
              </tr>
            </tbody>
          </table>
          <h4 style={{ marginTop: 0 }}>Applied Rule Assignments</h4>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Start</th>
                <th>End</th>
                <th>Subtotal</th>
                <th># of rules</th>
              </tr>
            </thead>
            <tbody>
              {session.appliedAssignments.map((assignment, i) => {
                const [start, end] = dateDisplay(
                  assignment.start,
                  assignment.end
                );
                return (
                  <tr
                    key={`${i}:${highlightedAssignment}`}
                    className={styles.assignmentRow}
                    onMouseOver={() => setHighlightedAssignment(i)}
                    onMouseLeave={() => setHighlightedAssignment(null)}
                    style={{
                      backgroundColor:
                        highlightedAssignment === i
                          ? HIGHLIGHT_COLOR
                          : "default",
                    }}
                  >
                    <td style={{ color: Color.LIGHT_GREY }}>{i + 1}</td>
                    <td>{start}</td>
                    <td>{end}</td>
                    <td>{assignment.feeCents / 100}</td>
                    <td>{assignment.rules.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h4>Applied Parking Rules</h4>
          <table>
            <thead>
              <tr>
                <th>A#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Permit</th>
                <th>Fee</th>
                <th>T unit</th>
                <th>Free units</th>
                <th>Rounding</th>
              </tr>
            </thead>
            <tbody>
              {session.appliedAssignments.flatMap((assignment, i) => {
                return assignment.rules.map((rule, j) => {
                  return (
                    <tr
                      key={`${i}:${j}:${highlightedAssignment}`}
                      onMouseOver={() => setHighlightedAssignment(i)}
                      onMouseLeave={() => setHighlightedAssignment(null)}
                      style={{
                        backgroundColor:
                          highlightedAssignment === i
                            ? HIGHLIGHT_COLOR
                            : "default",
                      }}
                    >
                      <td style={{ color: Color.LIGHT_GREY }}>{i + 1}</td>
                      <td>{rule.name}</td>
                      <td>{rule.__typename.replace("ParkingRule", "")}</td>
                      <td>
                        {rule.__typename === "ParkingRulePermitAccess"
                          ? rule.permit
                            ? "yes"
                            : "no"
                          : "-"}
                      </td>
                      <td>
                        {rule.__typename === "ParkingRuleTimedFee"
                          ? rule.centsPerUnitTime / 100
                          : "-"}
                      </td>
                      <td>
                        {rule.__typename === "ParkingRuleTimedFee"
                          ? rule.unitTime.slice(0, 1)
                          : "-"}
                      </td>
                      <td>
                        {rule.__typename === "ParkingRuleTimedFee"
                          ? rule.freeInUnitTime
                          : "-"}
                      </td>
                      <td>
                        {rule.__typename === "ParkingRuleTimedFee"
                          ? rule.roundingMethod
                          : "-"}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
