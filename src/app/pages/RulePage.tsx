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
import {
  SET_QUERY_VARS,
  SetQueryVars,
  CHANGE_OPENED_RULE_ASSIGNMENT
} from "../redux/modules/rulePageActionCreators";
import { ParkingRuleAssignmentSimulationOptions } from "../components/parkingRuleAssignment/ParkingRuleAssignmentSimulationOptions";
import { stylesheet } from "typestyle";
import {
  IRulePageStateSimulation,
  IRulePageState
} from "../redux/modules/rulePageModule";
import { VehicleFilterWidget } from "../components/editors/VehicleFilterEditor";
import { ParkingRuleWidget } from "../components/editors/ParkingRuleEditor";
import { Color } from "../constants";
import { ParkingRuleAssignmentMonth } from "../components/parkingRuleAssignment/ParkingRuleAssignmentMonth";

export interface IStateToProps {
  queryVariables: IRulePageState["queryVariables"];
  ruleAssignmentSimulation: IRulePageStateSimulation;
  selectedAssignment: IRulePageState["openedRuleAssignment"];
}

export interface IDispatchToProps {
  useFetchRules: (args: any) => any;
  useRuleSimulation: () => any;
  setQueryVariables: (newDay: SetQueryVars["payload"]) => any;
  setAssignment: (id: any) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  optionsWidget: {
    maxWidth: "25em",
    border: `1px solid ${Color.LIGHT_GREY}`,
    marginTop: "1em",
    padding: "0.5em",
    borderRadius: "3px"
  },
  widgetContainer: {
    display: "flex",
    $nest: {
      "> div": {
        margin: "1em 0.6em 0.8em 0.6em"
      }
    }
  }
});

const OptionsWidget = (props: { children: any }) => {
  return <div className={styles.optionsWidget}>{props.children}</div>;
};

const RulePage = (props: IProps) => {
  const [loadSimulation, { data: dataSimul }] = props.useRuleSimulation();
  const { loading, error, data, refetch } = props.useFetchRules(
    props.queryVariables
  );

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
          console.log(values);
          props.setQueryVariables(values);
          refetch();
        }}
        values={props.queryVariables}
      />
      <hr />
      {loading ? (
        <p>Loading</p>
      ) : error ? (
        <p>ERROR: {error.toString()}</p>
      ) : (
        <div>
          {props.queryVariables.range === "month" ? (
            <ParkingRuleAssignmentMonth
              date={props.queryVariables.date}
              data={data.parkingRuleAssignments}
              setSelectedDay={day => {
                props.setQueryVariables({ date: day, range: "day" });
                refetch();
              }}
              setAssignment={props.setAssignment}
              assignment={props.selectedAssignment}
            />
          ) : (
            <ParkingRuleAssignmentDay
              data={data.parkingRuleAssignments}
              day={props.queryVariables.date}
              appliedData={
                !!dataSimul && shouldShowSimulation
                  ? dataSimul.simulateRuleAssignmentApplication.appliedRules
                  : null
              }
              onNewOrDel={refetch}
            />
          )}
          {props.queryVariables.range === "month" ? null : (
            <div className={styles.widgetContainer}>
              <OptionsWidget>
                <ParkingRuleAssignmentSimulationOptions
                  feeCents={
                    !!dataSimul && shouldShowSimulation
                      ? dataSimul.simulateRuleAssignmentApplication.feeCents
                      : null
                  }
                />
              </OptionsWidget>
              <OptionsWidget>
                <VehicleFilterWidget />
              </OptionsWidget>
              <OptionsWidget>
                <ParkingRuleWidget />
              </OptionsWidget>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    queryVariables: state.rulePage.queryVariables,
    ruleAssignmentSimulation: state.rulePage.ruleAssignmentSimulation,
    selectedAssignment: state.rulePage.openedRuleAssignment
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    useFetchRules: filter => {
      const { range, date } = filter;
      const filter2 = { ...filter };
      delete filter2["date"];
      delete filter2["range"];

      if (range === "month") {
        filter2.endFilter = {
          gte: moment(date)
            .startOf(range)
            .subtract(7, "days")
            .toString()
        };
        filter2.startFilter = {
          lte: moment(date)
            .endOf(range)
            .add(7, "days")
            .toString()
        };
      } else {
        filter2.endFilter = {
          gte: moment(date)
            .startOf(range)
            .toString()
        };
        filter2.startFilter = {
          lte: moment(date)
            .endOf(range)
            .toString()
        };
      }
      return useQuery(RULE_PAGE_FETCH_PARKING_RULE_ASSIGNMENT_QUERY, {
        variables: filter2 || {},
        fetchPolicy: "cache-and-network"
      });
    },
    setQueryVariables: newVars =>
      dispatch({ type: SET_QUERY_VARS, payload: newVars }),
    useRuleSimulation: () => {
      return useLazyQuery(RULE_PAGE_RULE_SIMULATION_QUERY, {
        fetchPolicy: "no-cache"
      });
    },
    setAssignment: id =>
      dispatch({ type: CHANGE_OPENED_RULE_ASSIGNMENT, payload: { id } })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(RulePage);
export { connected as RulePage, RulePage as UnconnectedRulePage };
