import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  RulePageFetchParkingRuleAssignmentsQuery,
  RULE_SIMULATION_QUERY
} from "../constants/Queries";
import {
  ParkingRuleAssignmentFilter,
  IValues as FilterValues
} from "../components/parkingRuleAssignment/ParkingRuleAssignmentFilter";
import { ParkingRuleAssignmentDay } from "../components/parkingRuleAssignment/ParkingRuleAssignmentDay";
import moment from "moment";
import { IStore } from "../redux/IStore";
import { SET_SELECTED_DAY } from "../redux/modules/rulePageActionCreators";
import { useTwoPicker } from "../components/TwoPicker";

export interface IStateToProps {
  selectedDay: string;
}

export interface IDispatchToProps {
  useFetchRules: (filter?: any) => any;
  useRuleSimulation: () => any;
  setSelectedDay: (newDay: string) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const RulePage = (props: IProps) => {
  const [queryVariables, setQueryVariables] = useState<any>({
    day: props.selectedDay
  });
  // Always get .day from props
  if (queryVariables.day !== props.selectedDay) {
    setQueryVariables({ ...queryVariables, day: props.selectedDay });
  }

  const [
    loadSimulation,
    { data: dataSimul, refetch: refetchSimulation }
  ] = props.useRuleSimulation();
  const { loading, error, data, refetch } = props.useFetchRules(queryVariables);
  const [shouldSimulateComp, shouldSimulate] = useTwoPicker(
    "SIM OFF",
    "SIM ON"
  );

  const [simulVars, setSimulVars] = useState({
    vehicle: "5df4e4b7ec5214271d220b0a",
    start: new Date().toISOString(),
    end: new Date().toISOString()
  });
  const simulate = () => {
    if (shouldSimulate === "SIM ON") {
      console.log("RUN");
      const args = { variables: simulVars };
      if (!!refetchSimulation) refetchSimulation(args);
      else loadSimulation(args);
    }
  };
  useEffect(() => {
    console.log("EFF SIM");
    simulate();
  }, [shouldSimulate, simulVars]);

  const onShouldRefetch = (values: FilterValues) => {
    setQueryVariables(values);
    refetch();
    simulate();
  };

  const onChangeSimulVars = e => {
    const newSimulVars = {
      ...simulVars,
      [e.target.name]: e.target.value
    };
    setSimulVars(newSimulVars);
  };

  return (
    <div>
      <ParkingRuleAssignmentFilter
        onChange={values => {
          props.setSelectedDay(values.day);
          onShouldRefetch(values);
        }}
        onSubmit={onShouldRefetch}
        values={queryVariables}
      />
      <hr />
      <div>
        data=<b>{JSON.stringify(data, null, 2)}</b>
      </div>
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
              !!dataSimul && shouldSimulate
                ? dataSimul.simulateRuleAssignmentApplication
                : null
            }
          />
          <input
            name="vehicle"
            value={simulVars["vehicle"]}
            onChange={onChangeSimulVars}
          />
          <input
            name="start"
            value={simulVars["start"]}
            onChange={onChangeSimulVars}
          />
          <input
            name="end"
            value={simulVars["end"]}
            onChange={onChangeSimulVars}
          />
          {shouldSimulateComp}
          <br />
          <code>{JSON.stringify(dataSimul, null, 2)}</code>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    selectedDay: state.rulePage.selectedDay
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
      return useQuery(RulePageFetchParkingRuleAssignmentsQuery, {
        variables: filter2 || {}
      });
    },
    setSelectedDay: newDay =>
      dispatch({ type: SET_SELECTED_DAY, payload: { day: newDay } }),
    useRuleSimulation: () => {
      return useLazyQuery(RULE_SIMULATION_QUERY, { fetchPolicy: "no-cache" });
    }
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
