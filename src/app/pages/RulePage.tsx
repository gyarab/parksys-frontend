import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  RULE_PAGE_FETCH_PARKING_RULE_ASSIGNMENT_QUERY,
  RULE_PAGE_RULE_SIMULATION_QUERY
} from "../constants/Queries";
import {
  ParkingRuleAssignmentFilter,
  IValues as FilterValues
} from "../components/parkingRuleAssignment/ParkingRuleAssignmentFilter";
import { ParkingRuleAssignmentDay } from "../components/parkingRuleAssignment/ParkingRuleAssignmentDay";
import moment from "moment";
import { IStore } from "../redux/IStore";
import {
  SET_SELECTED_DAY,
  CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS
} from "../redux/modules/rulePageActionCreators";
import { TwoPicker } from "../components/TwoPicker";
import { DatePicker } from "../components/DatePicker";

export interface IStateToProps {
  selectedDay: string;
  ruleAssignmentSimulation: {
    on: boolean;
    start: Date;
    end: Date;
    vehicle: string; // id
  };
}

export interface IDispatchToProps {
  useFetchRules: (filter?: any) => any;
  useRuleSimulation: () => any;
  setSelectedDay: (newDay: string) => any;
  changeSimulateRuleAssignmentsOptions: (value: object) => any;
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

  const [loadSimulation, { data: dataSimul }] = props.useRuleSimulation();
  const { loading, error, data, refetch } = props.useFetchRules(queryVariables);

  const simulate = () => {
    if (props.ruleAssignmentSimulation.on) {
      const args = { variables: props.ruleAssignmentSimulation };
      loadSimulation(args);
      return;
    }
  };
  useEffect(() => {
    simulate();
  }, [props.ruleAssignmentSimulation]);

  const onShouldRefetch = (values: FilterValues) => {
    setQueryVariables(values);
    refetch();
    simulate();
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
              !!dataSimul && props.ruleAssignmentSimulation.on
                ? dataSimul.simulateRuleAssignmentApplication
                : null
            }
          />
          <input
            name="vehicle"
            value={props.ruleAssignmentSimulation.vehicle}
            onChange={e =>
              props.changeSimulateRuleAssignmentsOptions({
                vehicle: e.target.value
              })
            }
          />
          <DatePicker
            value={props.ruleAssignmentSimulation.start}
            onChange={start =>
              props.changeSimulateRuleAssignmentsOptions({ start })
            }
          />
          <DatePicker
            value={props.ruleAssignmentSimulation.end}
            onChange={end =>
              props.changeSimulateRuleAssignmentsOptions({ end })
            }
          />
          <TwoPicker
            optionLeft="SIM OFF"
            optionRight="SIM ON"
            leftIsSelected={!props.ruleAssignmentSimulation.on}
            onChange={v =>
              props.changeSimulateRuleAssignmentsOptions({ on: v === "SIM ON" })
            }
          />
          <br />
          <code>{JSON.stringify(dataSimul, null, 2)}</code>
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
    },
    changeSimulateRuleAssignmentsOptions: payload =>
      dispatch({ type: CHANGE_SIMULATE_RULES_ASSIGNMENTS_OPTIONS, payload })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
