import gql from "graphql-tag";

export const PARKING_RULE_ASSIGNMENT_FRAGMENT = gql`
  fragment ParkingRuleAssignmentArgs on ParkingRuleAssignment {
    id
    start
    end
    vehicleFilterMode
    priority
    active
    vehicleFilters {
      id
      name
      action
    }
    rules {
      id
      name
      __typename
      ... on ParkingRulePermitAccess {
        permit
      }
      ... on ParkingRuleTimedFee {
        centsPerUnitTime
        unitTime
      }
    }
  }
`;

export const VEHICLE_FILTER_FRAGMENT = gql`
  fragment VehicleFilterArgs on VehicleFilter {
    id
    name
    action
    vehicles {
      id
      licensePlate
    }
  }
`;
