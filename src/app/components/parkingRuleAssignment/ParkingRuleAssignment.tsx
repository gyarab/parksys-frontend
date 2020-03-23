import React from "react";
import { stylesheet, classes } from "typestyle";
import { Color } from "../../constants";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CHANGE_OPENED_RULE_ASSIGNMENT } from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { ParkingRuleAssignmentDetails } from "./ParkingRuleAssignmentDetails";
import { CloseAction } from "./CloseAction";

export interface IDispatchToProps {
  changeOpenedRuleAssignment(id: string | null): void;
}

export interface IStateToProps {
  toggledId: string | null;
  collidingIds: Set<string>;
}

export interface IProps extends IStateToProps, IDispatchToProps {
  assignment: any;
  onNewOrDel: () => void;
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
      ".cellBody": {
        height: "100%",
        width: "100%",
        position: "relative"
      }
    }
  },
  inactiveCell: {
    backgroundColor: Color.LIGHT_GREY,
    borderColor: Color.LIGHT_GREY
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
  collidingIds,
  onNewOrDel
}: IProps) => {
  modifyAssignment(assignment);
  const toggled = toggledId === assignment.id;
  const toggleDetails = action => {
    changeOpenedRuleAssignment(assignment.id);
    if (action === CloseAction.DELETE || action === CloseAction.SAVE) {
      onNewOrDel();
    }
  };
  const extraStyle = collidingIds.has(assignment.id)
    ? { border: `2px solid ${Color.LIGHT_RED}` }
    : {};
  return (
    <div
      className={classes(
        styles.cell,
        !assignment.active ? styles.inactiveCell : null
      )}
      style={extraStyle}
    >
      <div className={"cellBody"} onClick={toggleDetails}>
        <span>
          {assignment.rules.map(rule => rule.name).join(", ")} -{" "}
          {assignment.vehicleFilterMode === "NONE" ? "NONE except" : "ALL"}{" "}
          {assignment.vehicleFilters.map(filter => filter.name).join(", ")}
        </span>
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
    toggledId: state.rulePage.openedRuleAssignment.id,
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
