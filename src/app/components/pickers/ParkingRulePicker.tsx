import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./generic/GenericModelPicker";
import React from "react";
import { RULE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./generic/GenericModelMultiPicker";
import { ParkingRule } from "../ParkingRule";

const QUERY = RULE_PICKER_SEARCH_QUERY;
const arrayGetter = data => data.parkingRuleSearch.data;
const renderModel = model => <ParkingRule model={model} />;
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
