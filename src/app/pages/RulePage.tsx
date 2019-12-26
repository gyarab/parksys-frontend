import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { RulePageFetchParkingRuleAssignmentsQuery } from "../constants/Queries";
import {
  ParkingRuleAssignmentFilter,
  IValues as FilterValues
} from "../components/ParkingRuleAssignmentFilter";
import { ParkingRuleAssignmentDay } from "../components/ParkingRuleAssignmentDay";
import moment from "moment";
import { Button } from "../components/Button";
import gql from "graphql-tag";
import { IStore } from "../redux/IStore";
import { SET_SELECTED_DAY } from "../redux/modules/rulePageActionCreators";

export interface IStateToProps {
  selectedDay: string;
}

export interface IDispatchToProps {
  useFetchRules: (filter?: any) => any;
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
  const { loading, error, data, refetch } = props.useFetchRules(queryVariables);

  const onShouldRefetch = (values: FilterValues) => {
    setQueryVariables(values);
    refetch();
  };

  const [simulVars, setSimulVars] = useState({
    vehicle: "5df4e4b7ec5214271d220b0a",
    start: new Date().toISOString(),
    end: new Date().toISOString()
  });
  const onChange = e => {
    const newSimulVars = {
      ...simulVars,
      [e.target.name]: e.target.value
    };
    setSimulVars(newSimulVars);
  };

  const [loadSimulation, { data: dataSimul }] = useLazyQuery(gql`
    query vehicleRuleSimulation(
      $vehicle: ID!
      $start: DateTime!
      $end: DateTime!
    ) {
      simulateRuleAssignmentApplication(
        vehicle: $vehicle
        start: $start
        end: $end
      ) {
        start
        end
        assignment {
          id
          priority
        }
      }
    }
  `);

  const simulate = () => {
    loadSimulation({
      variables: simulVars
    });
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
              !!dataSimul ? dataSimul.simulateRuleAssignmentApplication : null
            }
          />
          <input
            name="vehicle"
            value={simulVars["vehicle"]}
            onChange={onChange}
          />
          <input name="start" value={simulVars["start"]} onChange={onChange} />
          <input name="end" value={simulVars["end"]} onChange={onChange} />
          <Button onClick={simulate}>Simulate</Button>
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
      dispatch({ type: SET_SELECTED_DAY, payload: { day: newDay } })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
