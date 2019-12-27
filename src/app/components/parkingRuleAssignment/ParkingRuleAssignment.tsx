import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../../constants";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_OPENED_RULE_ASSIGNMENT } from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { ParkingRuleAssignmentDetails } from "./ParkingRuleAssignmentDetails";

export interface IDispatchToProps {
  changeOpenedRuleAssignment(id: string | null): void;
}

export interface IStateToProps {
  toggledId: string | null;
  collidingIds: Set<string>;
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
    padding: "2px",
    border: `2px solid ${Color.AQUAMARINE}`,
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
        width: "23em",
        minHeight: "8em",
        backgroundColor: "white",
        boxShadow: "0px 0px 3px 1px #888",
        cursor: "default"
      },
      ".cellBody": {
        height: "100%",
        width: "100%",
        position: "relative"
      }
    }
  }
});

const modifyAssignment = assignment => {
  assignment.start = new Date(assignment.start);
  assignment.end = new Date(assignment.end);
};

const ParkingRuleAssignment = ({
  assignment,
  toggledId,
  changeOpenedRuleAssignment,
  collidingIds
}: IProps) => {
  modifyAssignment(assignment);
  const toggled = toggledId === assignment.id;
  const toggleDetails = () => {
    changeOpenedRuleAssignment(assignment.id);
  };
  const extraStyle = collidingIds.has(assignment.id)
    ? { border: `2px solid ${Color.LIGHT_RED}` }
    : {};
  return (
    <div className={styles.cell} style={extraStyle}>
      <div className={"cellBody"} onClick={toggleDetails}>
        <span style={{ fontFamily: "monospace" }}>{assignment.id}</span>
      </div>
      {toggled ? (
        <ParkingRuleAssignmentDetails
          assignment={assignment}
          close={toggleDetails}
        />
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
    toggledId: state.rulePage.openedRuleAssignmentId,
    collidingIds: state.rulePage.collidingRuleAssignments
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
