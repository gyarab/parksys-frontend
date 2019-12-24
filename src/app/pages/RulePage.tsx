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

export interface IStateToProps {}

export interface IDispatchToProps {
  useFetchRules: (filter?: any) => any;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const RulePage = (props: IProps) => {
  const [queryVariables, setQueryVariables] = useState<any>({
    day: moment()
      .toDate()
      .toISOString()
  });
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
    console.log("SIMULATE");
    loadSimulation({
      variables: simulVars
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>ERROR: {error}</div>;
  } else {
    return (
      <div>
        <ParkingRuleAssignmentFilter
          onChange={() => {}}
          onSubmit={onShouldRefetch}
          values={queryVariables}
        />
        <hr />
        <div>
          data=<b>{JSON.stringify(data, null, 2)}</b>
        </div>
        <hr />
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
    );
  }
};

const mapDispatchToProps = (_: Dispatch): IDispatchToProps => {
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
    }
  };
};

const connected = connect(null, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
