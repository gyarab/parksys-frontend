import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useQuery } from "@apollo/react-hooks";
import { RulePageFetchParkingRuleAssignmentsQuery } from "../constants/Queries";
import {
  ParkingRuleAssignmentFilter,
  IValues as FilterValues
} from "../components/ParkingRuleAssignmentFilter";
import { ParkingRuleAssignmentDay } from "../components/ParkingRuleAssignmentDay";
import moment from "moment";

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
        />
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
      console.log(filter2);
      return useQuery(RulePageFetchParkingRuleAssignmentsQuery, {
        variables: filter2 || {}
      });
    }
  };
};

const connected = connect(null, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
