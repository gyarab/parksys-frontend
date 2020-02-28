import gql from "graphql-tag";
import {
  PARKING_RULE_ASSIGNMENT_FRAGMENT,
  VEHICLE_FILTER_FRAGMENT,
  PARKING_RULE_FRAGMENT
} from "./Fragments";

// Log in
export const LOGIN_MUTATION = gql`
  mutation login($user: String!, $password: String!) {
    passwordLogin(user: $user, password: $password) {
      refreshToken
      accessToken
      user {
        id
        name
        email
        permissions
        isAdmin
      }
    }
  }
`;

// Device
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

export const DEVICE_PAGE_UPDATE_CONFIG_MUTATION = gql`
  mutation updateDeviceConfig($id: ID!, $config: DeviceConfigUpdateInput!) {
    updateDeviceConfig(id: $id, config: $config) {
      config {
        type
        capturing
        minArea
        resizeX
        resizeY
      }
    }
  }
`;

// ParkingRuleAssignment
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

// VehicleFilter
export const RULE_PAGE_UPDATE_VEHICLE_FILTER = gql`
  mutation updateVehicleFilter($id: ID!, $input: VehicleFilterUpdateInput!) {
    updateVehicleFilter(id: $id, input: $input) {
      ...VehicleFilterArgs
    }
  }
  ${VEHICLE_FILTER_FRAGMENT}
`;

export const RULE_PAGE_CREATE_VEHICLE_FILTER = gql`
  mutation createVehicleFilter($input: VehicleFilterCreateInput!) {
    createVehicleFilter(input: $input) {
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

// ParkingRule
export const RULE_PAGE_UPDATE_PARKING_RULE = gql`
  mutation updateParkingRule($id: ID!, $input: ParkingRuleUpdateInput!) {
    updateParkingRule(id: $id, input: $input) {
      id
      ...ParkingRuleArgs
    }
  }
  ${PARKING_RULE_FRAGMENT}
`;

export const RULE_PAGE_CREATE_PARKING_RULE = gql`
  mutation createParkingRule($input: ParkingRuleCreateInput!) {
    createParkingRule(input: $input) {
      id
      ...ParkingRuleArgs
    }
  }
  ${PARKING_RULE_FRAGMENT}
`;

export const RULE_PAGE_DELETE_PARKING_RULE = gql`
  mutation deleteParkingRule($id: ID!) {
    deleteParkingRule(id: $id) {
      id
    }
  }
`;

// User Page
export const PASSWORD_CHANGE_MUTATION = gql`
  mutation passwordChange($input: PasswordChangeInput!) {
    passwordChange(input: $input)
  }
`;

// User Management
export const USER_UPDATE_MUTATION = gql`
  mutation updateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`;

export const USER_DELETE_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
