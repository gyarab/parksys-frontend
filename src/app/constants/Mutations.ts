import gql from "graphql-tag";
import {
  PARKING_RULE_ASSIGNMENT_FRAGMENT,
  VEHICLE_FILTER_FRAGMENT
} from "./Fragments";

export const DEVICE_PAGE_CREATE_DEVICE_MUTATION = gql`
  mutation createDevice($name: String!) {
    createDevice(input: { name: $name }) {
      id
      name
      activationQrUrl
    }
  }
`;

export const DEVICE_PAGE_DELETE_DEVICE_MUTATION = gql`
  mutation deleteDevice($id: ID!) {
    deleteDevice(id: $id) {
      id
    }
  }
`;

export const RULE_PAGE_UPDATE_RULE_ASSIGNMENT_MUTATION = gql`
  mutation updateRuleAssignment(
    $id: ID!
    $input: ParkingRuleAssignmentUpdateInput!
  ) {
    result: updateParkingRuleAssignment(id: $id, input: $input) {
      __typename
      ... on ParkingRuleAssignment {
        ...ParkingRuleAssignmentArgs
      }
      ... on ParkingRuleAssignmentResultError {
        collisions {
          id
        }
      }
    }
  }
  ${PARKING_RULE_ASSIGNMENT_FRAGMENT}
`;

export const RULE_PAGE_CREATE_RULE_ASSIGNMENT_MUTATION = gql`
  mutation createRuleAssignment($input: ParkingRuleAssignmentCreateInput!) {
    result: createParkingRuleAssignment(input: $input) {
      __typename
      ... on ParkingRuleAssignment {
        ...ParkingRuleAssignmentArgs
      }
      ... on ParkingRuleAssignmentResultError {
        collisions {
          id
        }
      }
    }
  }
  ${PARKING_RULE_ASSIGNMENT_FRAGMENT}
`;

export const RULE_PAGE_DELETE_RULE_ASSIGNMENT_MUTATION = gql`
  mutation deleteRuleAssignment($id: ID!) {
    deleteParkingRuleAssignment(id: $id) {
      id
    }
  }
`;

export const RULE_PAGE_UPDATE_VEHICLE_FILTER = gql`
  mutation updateVehicleFilter($id: ID!, $input: VehicleFilterUpdateInput!) {
    updateVehicleFilter(id: $id, input: $input) {
      ...VehicleFilterArgs
    }
  }
  ${VEHICLE_FILTER_FRAGMENT}
`;

export const RULE_PAGE_DELETE_VEHICLE_FILTER = gql`
  mutation deleteVehicleFilter($id: ID!) {
    deleteVehicleFilter(id: $id) {
      id
    }
  }
`;

export const RULE_PAGE_CREATE_VEHICLE_FILTER = gql`
  mutation createVehicleFilter($input: VehicleFilterCreateInput!) {
    createVehicleFilter(input: $input) {
      ...VehicleFilterArgs
    }
  }
  ${VEHICLE_FILTER_FRAGMENT}
`;
