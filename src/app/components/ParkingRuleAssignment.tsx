import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_OPENED_RULE_ASSIGNMENT } from "../redux/modules/rulePageActionCreators";
import { IStore } from "../redux/IStore";

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
        minWidth: "12em",
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
  }
});

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
      {!toggled ? null : (
        <div className="details">
          <span className="close" onClick={toggleDetails}>
            x
          </span>
          <code>{JSON.stringify(assignment, null, 2)}</code>
        </div>
      )}
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
