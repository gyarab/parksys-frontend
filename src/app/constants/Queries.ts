import gql from "graphql-tag";

export const RulePageFetchParkingRuleAssignmentsQuery = gql`
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
      id
      start
      end
      vehicleFilterMode
      priority
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
  }
`;
