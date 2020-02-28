import React, { useState } from "react";
import { stylesheet } from "typestyle";
import { useQuery } from "@apollo/react-hooks";
import { PARKING_SESSION_BY_ID_QUERY } from "../constants/Queries";
import lodash from "lodash";
import { VehicleLink } from "./VehicleLink";
import { dateDisplay } from "../helpers/componentHelpers";
import { Color } from "../constants";
import imageGetter from "../helpers/imageGetter";

const styles = stylesheet({
  sessionDisplay: {
    gridTemplateColumns: "auto auto",
    $nest: {
      table: {
        marginBottom: "1em",
        minWidth: "30%"
      }
    }
  },
  captureImage: {
    position: "relative",
    $nest: {
      "&:hover": {
        cursor: "pointer"
      },
      img: {
        position: "absolute",
        top: "100%",
        left: 0,
        boxShadow: "0px 0px 4px 2px #666"
      }
    }
  }
});

const CaptureImage = ({ image, text }) => {
  const [imageData, setImageData] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const onHover = () => {
    setShowImage(true);
    if (!imageData && !!image) {
      // fetch
      imageGetter(image)
        .then(response => response.blob())
        .then(blob => {
          setImageData(URL.createObjectURL(blob));
        })
        .catch(err => {
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

export const ParkingSessionDisplay = ({ session: { id } }) => {
  const { data, loading, error } = useQuery(PARKING_SESSION_BY_ID_QUERY, {
    variables: {
      id
    }
  });
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
    <div className={styles.sessionDisplay}>
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
              <CaptureImage
                key={session.id}
                text={start}
                image={lodash.get(session, "checkIn.imagePaths.0", null)}
              />
            </td>
            <td>
              <CaptureImage
                key={session.id}
                text={end}
                image={lodash.get(session, "checkOut.imagePaths.0", null)}
              />
            </td>
            <td>{session.finalFee / 100}</td>
            <td>
              <VehicleLink vehicle={session.vehicle} />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <h4 style={{ marginTop: 0 }}>Applied Rule Assignments</h4>
        <table>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Subtotal</th>
              <th># of rules</th>
            </tr>
          </thead>
          <tbody>
            {session.appliedAssignments.map(assignment => {
              const [start, end] = dateDisplay(
                assignment.start,
                assignment.end
              );
              return (
                <tr>
                  <td>{start}</td>
                  <td>{end}</td>
                  <td>{assignment.feeCents}</td>
                  <td>{assignment.rules.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
