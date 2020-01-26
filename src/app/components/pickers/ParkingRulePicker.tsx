import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { RULE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";

const QUERY = RULE_PICKER_SEARCH_QUERY;
const arrayGetter = data => data.parkingRuleSearch.data;
const renderModel = model => <>{model.name}</>;
const identifierToOptions = name => ({ variables: { name } });
const modelToIdentifier = model => model.name;

export const ParkingRulePicker = GenericModelPicker({
  QUERY,
  arrayGetter,
  renderModel,
  identifierToOptions
});

export const useParkingRulePicker = useGenericPickerFromPicker(
  ParkingRulePicker,
  modelToIdentifier
);

export const useParkingRuleMultiPicker = useGenericMultiPicker({
  QUERY,
  arrayGetter,
  renderModel,
  modelToIdentifier,
  identifierAndCurrentModelsToOptions: identifierToOptions
});
