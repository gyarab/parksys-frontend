import gql from "graphql-tag";
import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";

export const RulePicker = GenericModelPicker({
  QUERY: gql`
    query {
      parkingRules {
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
  `,
  arrayGetter: data => data.parkingRules,
  renderModel: model => <>{model.name}</>,
  identifierToOptions: name => ({ variables: { name } })
});

export const useRulePicker = useGenericPickerFromPicker(
  RulePicker,
  model => model.name
);
