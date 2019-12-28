import gql from "graphql-tag";
import { PARKING_RULE_ASSIGNMENT_FRAGMENT } from "./Fragments";

export const RULE_PAGE_FETCH_PARKING_RULE_ASSIGNMENT_QUERY = gql`
  query parkingRuleAssignments(
    $startFilter: DateFilter
    $endFilter: DateFilter
    $vehicleFilterMode: VehicleFilterMode
  ) {
    parkingRuleAssignments(
      filter: {
        startFilter: $startFilter
        endFilter: $endFilter
        vehicleFilterMode: $vehicleFilterMode
      }
    ) {
      ...ParkingRuleAssignmentArgs
    }
  }
  ${PARKING_RULE_ASSIGNMENT_FRAGMENT}
`;

export const RULE_PAGE_RULE_SIMULATION_QUERY = gql`
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
`;

export const VEHICLE_PICKER_SEARCH_QUERY = gql`
  query vehicleSearch($licensePlate: String!) {
    vehicleSearch(search: { licensePlate: $licensePlate, limit: 10 }) {
      data {
        id
        licensePlate
      }
    }
  }
`;

export const RULE_PICKER_SEARCH_QUERY = gql`
  query searchParkingRules($name: String!) {
    parkingRuleSearch(search: { name: $name }) {
      data {
        id
        name
        ... on ParkingRulePermitAccess {
          permit
        }
        ... on ParkingRuleTimedFee {
          centsPerUnitTime
          unitTime
        }
      }
    }
  }
`;

export const VEHICLE_FILTER_PICKER_SEARCH_QUERY = gql`
  query searchVehicleFilters($name: String!) {
    vehicleFilterSearch(search: { name: $name }) {
      data {
        id
        name
        action
      }
    }
  }
`;
