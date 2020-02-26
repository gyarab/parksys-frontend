import gql from "graphql-tag";
import {
  PARKING_RULE_ASSIGNMENT_FRAGMENT,
  VEHICLE_FILTER_FRAGMENT,
  PARKING_RULE_FRAGMENT,
  USER_FRAGMENT
} from "./Fragments";

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
    vehicleSearch(search: { licensePlate: $licensePlate, limit: 5 }) {
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
        ...VehicleFilterArgs
      }
    }
  }
  ${VEHICLE_FILTER_FRAGMENT}
`;

export const PARKING_RULE_SEARCH_QUERY = gql`
  query parkingRuleSearch($name: String!) {
    parkingRuleSearch(search: { name: $name }) {
      date {
        ...ParkingRuleArgs
      }
    }
  }
  ${PARKING_RULE_FRAGMENT}
`;

export const USER_SEARCH_QUERY = gql`
  query userSearch($query: String!) {
    byEmail: userSearchByEmail(search: { email: $query }) {
      data {
        ...UserArgs
      }
      limit
      page
    }
    byName: userSearch(search: { name: $query }) {
      data {
        ...UserArgs
      }
      limit
      page
    }
  }
  ${USER_FRAGMENT}
`;

export const STATS_PAGE = {
  YEAR: gql`
    query yearStats($year: PositiveInt!) {
      yearStats(year: $year) {
        year

        data {
          numParkingSessions
          revenueCents
        }
        monthly {
          month
          data {
            numParkingSessions
            revenueCents
          }
        }
      }
    }
  `,
  MONTH: gql`
    query monthStats($year: PositiveInt!, $month: PositiveInt!) {
      monthStats(year: $year, month: $month) {
        year
        month

        data {
          numParkingSessions
          revenueCents
        }
        daily {
          date

          data {
            numParkingSessions
            revenueCents
          }
        }
      }
    }
  `,
  DAY: gql`
    query dayStats(
      $year: PositiveInt!
      $month: PositiveInt!
      $date: PositiveInt!
    ) {
      dayStats(year: $year, month: $month, date: $date) {
        year
        month
        date

        data {
          numParkingSessions
          revenueCents
        }
        hourly {
          hour
          data {
            numParkingSessions
            revenueCents
          }
        }
      }
    }
  `,
  YEAR_DAY: gql`
    query yearDayStats($year: PositiveInt!) {
      yearStats(year: $year) {
        year
        daily {
          year
          month
          date

          data {
            numParkingSessions
            revenueCents
          }
        }
      }
    }
  `
};

// Parking Session
export const PARKING_SESSIONS_PAGED_QUERY = gql`
  query parkingSessionsPaged(
    $page: PositiveInt
    $limit: PositiveInt
    $filter: DateFilterInput!
  ) {
    parkingSessionsFilter(
      input: { dateFilter: $filter, page: $page, limit: $limit }
    ) {
      data {
        id
        vehicle {
          id
          licensePlate
        }
        checkOut {
          time
        }
        checkIn {
          time
        }
        active
        finalFee
      }
      page
      limit
    }
  }
`;
