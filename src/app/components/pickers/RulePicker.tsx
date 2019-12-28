import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { RULE_PICKER_SEARCH_QUERY } from "../../constants/Queries";

export const RulePicker = GenericModelPicker({
  QUERY: RULE_PICKER_SEARCH_QUERY,
  arrayGetter: data => data.parkingRuleSearch.data,
  renderModel: model => <>{model.name}</>,
  identifierToOptions: name => ({ variables: { name } })
});

export const useRulePicker = useGenericPickerFromPicker(
  RulePicker,
  model => model.name
);
