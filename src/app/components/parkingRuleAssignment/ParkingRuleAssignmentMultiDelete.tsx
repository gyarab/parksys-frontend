import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { Button } from "../Button";
import {
  SetSelectedDay,
  SET_SELECTED_DAY
} from "../../redux/modules/rulePageActionCreators";
import { IStore } from "../../redux/IStore";
import { RULE_PAGE_DELETE_RULE_ASSIGNMENTS_MUTATION } from "../../constants/Mutations";

interface IDispatchToProps {
  deleteRuleAssignments: () => MutationTuple<
    { deleteParkingRuleAssignment: any },
    { start: Date; end: Date }
  >;
  setSelectedDays: (days: SetSelectedDay["payload"]) => void;
}

interface IStateToProps {
  selectedDays: IRulePageState["selectedDays"];
  daySelectorMode: IRulePageState["daySelectorMode"];
}

interface IProps extends IDispatchToProps, IStateToProps {
  refetch: () => void;
}

const ParkingRuleAssignmentMultiDelete = (props: IProps) => {
  const [deleteEffect] = props.deleteRuleAssignments();
  const deleteAssignments = () => {
    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;
    // O(2)
    Object.keys(props.selectedDays).forEach(sStart => {
      const sEnd = props.selectedDays[sStart];
      min = Math.min(Number(sStart), min);
      max = Math.max(sEnd, max);
    });
    deleteEffect({
      variables: {
        start: new Date(min),
        end: new Date(max)
      }
    }).then(result => {
      // Reset on success
      props.setSelectedDays(null);
      // Refetch
      props.refetch();
    });
  };
  const dontDelete = Object.keys(props.selectedDays).length === 0;
  return (
    <div>
      <Button type="primary" disabled={dontDelete} onClick={deleteAssignments}>
        Delete
      </Button>
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    selectedDays: state.rulePage.selectedDays,
    daySelectorMode: state.rulePage.daySelectorMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    deleteRuleAssignments: () =>
      useMutation(RULE_PAGE_DELETE_RULE_ASSIGNMENTS_MUTATION),
    setSelectedDays: days => dispatch({ type: SET_SELECTED_DAY, payload: days })
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleAssignmentMultiDelete);

export {
  connected as ParkingRuleAssignmentMultiDelete,
  ParkingRuleAssignmentMultiDelete as UnconnectedParkingRuleAssignmentMultiDelete
};
