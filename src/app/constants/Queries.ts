import gql from "graphql-tag";

export const RulePageFetchParkingRuleAssignmentsQuery = gql`
  query parkingRuleAssignments(
    $startFilter: DateFilter
    $endFilter: DateFilter
    $vehicleSelectorMode: VehicleSelectorMode
  ) {
    parkingRuleAssignments(
      filter: {
        startFilter: $startFilter
        endFilter: $endFilter
        vehicleSelectorMode: $vehicleSelectorMode
      }
    ) {
      id
      start
      end
      vehicleSelectorMode
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
