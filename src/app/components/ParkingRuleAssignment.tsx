import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_OPENED_RULE_ASSIGNMENT } from "../redux/modules/rulePageActionCreators";
import { IStore } from "../redux/IStore";
import { useTwoPicker } from "./TwoPicker";
import { useDatePicker } from "./DatePicker";

export interface IDispatchToProps {
  changeOpenedRuleAssignment(id: string | null): void;
}

export interface IStateToProps {
  toggledId: string | null;
}

export interface IProps extends IStateToProps, IDispatchToProps {
  assignment: any;
}

const styles = stylesheet({
  cell: {
    height: "100%",
    width: "100%",
    position: "relative",
    backgroundColor: Color.AQUAMARINE,
    borderRadius: "3px",
    $nest: {
      "&:hover": {
        boxShadow: "0px 0px 2px 1px #999",
        cursor: "pointer"
      },
      ".details": {
        position: "absolute",
        top: "2.5em",
        borderRadius: "3px",
        padding: "0.5em",
        paddingTop: "2em",
        width: "23em",
        minHeight: "8em",
        backgroundColor: "white",
        boxShadow: "0px 0px 3px 1px #888",
        cursor: "default",
        $nest: {
          ".close": {
            position: "absolute",
            right: "3px",
            top: "2px",
            padding: "3px",
            backgroundColor: "#000000bb",
            borderRadius: "10px",
            color: "white",
            lineHeight: "0.8em",
            textAlign: "center",
            height: "1.4em",
            width: "1.4em",
            fontFamily: "monospace",
            cursor: "pointer"
          }
        }
      },
      ".cellBody": {
        height: "100%",
        width: "100%",
        padding: "4px",
        position: "relative"
      }
    }
  },
  options: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center",
    $nest: {
      ".twoPickerContainer": {
        marginRight: "0.65em",
        $nest: {
          "> div": {
            float: "right"
          }
        }
      }
    }
  }
});

const Details = ({ assignment, close }) => {
  const [startPicker] = useDatePicker(new Date(assignment.start));
  const [endPicker] = useDatePicker(new Date(assignment.end));
  const [filterModePicker] = useTwoPicker(
    "NONE",
    "ALL",
    assignment.vehicleFilterMode === "NONE"
  );
  return (
    <div className="details">
      <span className="close" onClick={close}>
        x
      </span>
      <div className={styles.options}>
        <span>Start</span>
        {startPicker}
        <span>End</span>
        {endPicker}
        <span>Filter Mode</span>
        <div className="twoPickerContainer">{filterModePicker}</div>
      </div>
    </div>
  );
};

const ParkingRuleAssignment = ({
  assignment,
  toggledId,
  changeOpenedRuleAssignment
}: IProps) => {
  const toggled = toggledId === assignment.id;
  const toggleDetails = () => {
    changeOpenedRuleAssignment(assignment.id);
  };
  return (
    <div className={styles.cell}>
      <div className={"cellBody"} onClick={toggleDetails}>
        <span style={{ fontFamily: "monospace" }}>{assignment.id}</span>
      </div>
      {toggled ? (
        <Details assignment={assignment} close={toggleDetails} />
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    changeOpenedRuleAssignment: id =>
      dispatch({ type: CHANGE_OPENED_RULE_ASSIGNMENT, payload: { id } })
  };
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    toggledId: state.rulePage.openedRuleAssignmentId
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleAssignment);

export {
  ParkingRuleAssignment as UnconnectedParkingRuleAssignment,
  connected as ParkingRuleAssignment
};
