import gql from "graphql-tag";

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

export const PARKING_RULE_FRAGMENT = gql`
  fragment ParkingRuleArgs on ParkingRule {
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
`;

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
      ...ParkingRuleArgs
    }
  }
  ${PARKING_RULE_FRAGMENT}
`;

export const USER_FRAGMENT = gql`
  fragment UserArgs on User {
    id
    name
    email
    permissions
    isAdmin
    active
  }
`;
