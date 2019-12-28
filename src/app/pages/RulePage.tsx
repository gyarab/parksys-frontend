import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  RULE_PAGE_FETCH_PARKING_RULE_ASSIGNMENT_QUERY,
  RULE_PAGE_RULE_SIMULATION_QUERY
} from "../constants/Queries";
import { ParkingRuleAssignmentFilter } from "../components/parkingRuleAssignment/ParkingRuleAssignmentFilter";
import { ParkingRuleAssignmentDay } from "../components/parkingRuleAssignment/ParkingRuleAssignmentDay";
import moment from "moment";
import { IStore } from "../redux/IStore";
import { SET_SELECTED_DAY } from "../redux/modules/rulePageActionCreators";
import { ParkingRuleAssignmentSimulationOptions } from "../components/parkingRuleAssignment/ParkingRuleAssignmentSimulationOptions";
import { stylesheet } from "typestyle";
import { IRulePageStateSimulation } from "../redux/modules/rulePageModule";

export interface IStateToProps {
  selectedDay: string;
  ruleAssignmentSimulation: IRulePageStateSimulation;
}

export interface IDispatchToProps {
  useFetchRules: (filter?: any) => any;
  useRuleSimulation: () => any;
  setSelectedDay: (newDay: string) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  simulationOptionsContainer: {
    maxWidth: "21.2em",
    border: "1px solid #CCC",
    marginTop: "1em"
  }
});

const RulePage = (props: IProps) => {
  const [queryVariables, setQueryVariables] = useState<any>({
    day: props.selectedDay
  });
  // Always get .day from props
  if (queryVariables.day !== props.selectedDay) {
    setQueryVariables({ ...queryVariables, day: props.selectedDay });
  }

  const [loadSimulation, { data: dataSimul }] = props.useRuleSimulation();
  const { loading, error, data, refetch } = props.useFetchRules(queryVariables);

  const shouldShowSimulation =
    props.ruleAssignmentSimulation.on &&
    !!props.ruleAssignmentSimulation.vehicle;
  useEffect(() => {
    if (shouldShowSimulation && !!data) {
      loadSimulation({
        variables: {
          vehicle: props.ruleAssignmentSimulation.vehicle.id,
          start: props.ruleAssignmentSimulation.start,
          end: props.ruleAssignmentSimulation.end
        }
      });
    }
  }, [props.ruleAssignmentSimulation, data]);

  return (
    <div>
      <ParkingRuleAssignmentFilter
        onChange={values => {
          props.setSelectedDay(values.day);
          setQueryVariables(values);
        }}
        onSubmit={refetch}
        values={queryVariables}
      />
      <hr />
      {loading ? (
        <p>Loading</p>
      ) : error ? (
        <p>ERROR: {error.toString()}</p>
      ) : (
        <div>
          <ParkingRuleAssignmentDay
            data={data.parkingRuleAssignments}
            day={queryVariables.day}
            appliedData={
              !!dataSimul && shouldShowSimulation
                ? dataSimul.simulateRuleAssignmentApplication
                : null
            }
          />
          <div className={styles.simulationOptionsContainer}>
            <ParkingRuleAssignmentSimulationOptions />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    selectedDay: state.rulePage.selectedDay,
    ruleAssignmentSimulation: state.rulePage.ruleAssignmentSimulation
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    useFetchRules: filter => {
      const filter2 = { ...filter };
      delete filter2["day"];
      filter2.endFilter = {
        gte: moment(filter.day)
          .startOf("day")
          .toString()
      };
      filter2.startFilter = {
        lte: moment(filter.day)
          .endOf("day")
          .toString()
      };
      return useQuery(RULE_PAGE_FETCH_PARKING_RULE_ASSIGNMENT_QUERY, {
        variables: filter2 || {}
      });
    },
    setSelectedDay: newDay =>
      dispatch({ type: SET_SELECTED_DAY, payload: { day: newDay } }),
    useRuleSimulation: () => {
      return useLazyQuery(RULE_PAGE_RULE_SIMULATION_QUERY, {
        fetchPolicy: "no-cache"
      });
    }
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
