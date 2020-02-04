import {
  useGenericPickerFromPicker,
  GenericModelPicker
} from "./GenericModelPicker";
import React from "react";
import { RULE_PICKER_SEARCH_QUERY } from "../../constants/Queries";
import { useGenericMultiPicker } from "./GenericModelMultiPicker";
import { FlagType, Flag } from "../Flag";

const QUERY = RULE_PICKER_SEARCH_QUERY;
const arrayGetter = data => data.parkingRuleSearch.data;
const renderModel = model => (
  <div>
    <Flag
      type={FlagType.NONE}
      text={model.__typename.replace("ParkingRule", "")}
    />
    {model.name}
  </div>
);
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
