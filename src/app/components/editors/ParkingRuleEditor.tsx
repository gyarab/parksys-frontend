import React, { useState, useEffect } from "react";
import { TwoPicker } from "../pickers/TwoPicker";
import { stylesheet, setStylesTarget } from "typestyle";
import { Input } from "../Input";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  SET_PARKING_RULE,
  SetParkingRule
} from "../../redux/modules/rulePageActionCreators";
import { IRulePageState } from "../../redux/modules/rulePageModule";
import { IStore } from "../../redux/IStore";
import { Button } from "../Button";
import SaveStatus from "../../constants/SaveStatus";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import { ParkingRulePicker } from "../pickers/ParkingRulePicker";
import {
  RULE_PAGE_UPDATE_PARKING_RULE,
  RULE_PAGE_CREATE_PARKING_RULE,
  RULE_PAGE_DELETE_PARKING_RULE
} from "../../constants/Mutations";
import { OptionPicker } from "../pickers/OptionPicker";
import { NumberInput } from "../pickers/NumberInput";

export interface IStateToProps {
  parkingRule: IRulePageState["selectedParkingRule"];
}

export interface IDispatchToProps {
  setSelectedParkingRule: (payload: SetParkingRule["payload"]) => void;
  useUpdateParkingRule: () => MutationTuple<any, { id: string; input: any }>;
  useDeleteParkingRule: () => MutationTuple<any, { id: string }>;
  useCreateParkingRule: () => MutationTuple<any, { input: any }>;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const styles = stylesheet({
  pickers: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center"
  },
  header: {
    marginBottom: "0.5em",
    display: "grid",
    gridTemplateColumns: "2fr 3fr",
    alignItems: "center",
    justifyItems: "right",
    $nest: {
      div: {
        maxHeight: "2em"
      }
    }
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridColumnGap: "0.3em",
    marginBottom: "0.5em",
    marginTop: "0.5em",
    $nest: {
      button: {
        maxHeight: "3em"
      }
    }
  }
});

enum ParkingRuleTypes {
  ParkingRulePermitAccess = "ParkingRulePermitAccess",
  ParkingRuleTimedFee = "ParkingRuleTimedFee"
}

const ParkingRulePermitAccessSpecific = ({ typeSpecific, setTypeSpecific }) => {
  const { permit } = typeSpecific;
  return (
    <>
      <span>Permit</span>
      <TwoPicker
        optionLeft="No"
        optionRight="Yes"
        rightIsSelected={permit}
        onChange={value =>
          setTypeSpecific({ ...typeSpecific, permit: value === "Yes" })
        }
      />
    </>
  );
};

const ParkingRuleTimedFeeSpecific = ({ typeSpecific, setTypeSpecific }) => {
  const {
    unitTime,
    centsPerUnitTime,
    freeInUnitTime,
    roundingMethod
  } = typeSpecific;
  const onChange = ({ name, value }) => {
    setTypeSpecific({ ...typeSpecific, [name]: value });
  };
  return (
    <>
      <span>Time unit</span>
      <OptionPicker
        options={["HOUR", "MINUTE"]}
        selectedOption={unitTime}
        name="unitTime"
        onChange={onChange}
      />
      <span>Fee per {unitTime}</span>
      <NumberInput
        value={centsPerUnitTime / 100}
        onChange={value =>
          onChange({ value: value * 100, name: "centsPerUnitTime" })
        }
      />
      <span>Free {unitTime}S</span>
      <NumberInput
        value={freeInUnitTime}
        onChange={value => onChange({ value, name: "freeInUnitTime" })}
      />
      <span>Rounding method</span>
      <OptionPicker
        name="roundingMethod"
        options={["ROUND", "FLOOR", "CEIL"]}
        selectedOption={roundingMethod || "ROUND"}
        onChange={({ value, name }) => onChange({ value, name })}
      />
    </>
  );
};

const getTypeSpecific = rule => {
  const clone = { ...rule };
  delete clone.id;
  delete clone.name;
  delete clone.__typename;
  return clone;
};

export const ParkingRuleEditor = ({ rule, del, save, saveStatus, isNew }) => {
  const [name, setName] = useState(rule.name);
  const [type, setType] = useState(rule.__typename);
  const [typeSpecific, setTypeSpecific] = useState({
    unitTime: "HOUR",
    permit: false,
    freeInUnitTime: 0,
    centsPerUnitTime: 0,
    roundingMethod: "ROUND",
    ...getTypeSpecific(rule)
  });
  return (
    <div>
      <div className={styles.pickers}>
        {isNew ? (
          <>
            <span>Type</span>
            <OptionPicker
              options={
                type == null
                  ? ["select type", ...Object.values(ParkingRuleTypes)]
                  : Object.values(ParkingRuleTypes)
              }
              selectedOption={type || "select type"}
              name={"_t"}
              onChange={({ value }) => setType(value)}
            />
          </>
        ) : null}
        <span>Name</span>
        <input
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        {/* Other options are based on the specific type */}
        {type === ParkingRuleTypes.ParkingRulePermitAccess ? (
          <ParkingRulePermitAccessSpecific
            typeSpecific={typeSpecific}
            setTypeSpecific={setTypeSpecific}
          />
        ) : type === ParkingRuleTypes.ParkingRuleTimedFee ? (
          <ParkingRuleTimedFeeSpecific
            typeSpecific={typeSpecific}
            setTypeSpecific={setTypeSpecific}
          />
        ) : null}
      </div>
      <div className={styles.controls}>
        <Button onClick={() => del()} type="negative" disabled={isNew}>
          Delete
        </Button>
        <Button
          onClick={() => save({ ...typeSpecific, name, _t: type })}
          type="positive"
          disabled={!type || saveStatus === SaveStatus.SAVING}
        >
          {saveStatus}
        </Button>
      </div>
    </div>
  );
};

const ParkingRuleWidget = (props: IProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [updateEffect] = props.useUpdateParkingRule();
  const [deleteEffect] = props.useDeleteParkingRule();
  const [createEffect] = props.useCreateParkingRule();

  const onSuccess = ({ data, errors }) => {
    setSaveStatus(SaveStatus.NONE);
    props.setSelectedParkingRule(null);
    setIsNew(false);
  };
  const onFailed = err => {
    setSaveStatus(SaveStatus.FAILED);
  };

  const save = obj => {
    setSaveStatus(SaveStatus.SAVING);
    const promise = isNew
      ? createEffect({ variables: { input: obj } })
      : updateEffect({
          variables: {
            id: props.parkingRule.id,
            input: obj
          }
        });
    promise.then(onSuccess).catch(onFailed);
  };
  const del = () => {
    setSaveStatus(SaveStatus.SAVING);
    deleteEffect({
      variables: { id: props.parkingRule.id }
    })
      .then(onSuccess)
      .catch(onFailed);
  };
  const toggleNew = () => {
    if (isNew) {
      props.setSelectedParkingRule(null);
    } else {
      props.setSelectedParkingRule({
        id: null,
        name: "",
        __typename: null
      });
    }
    setSaveStatus(SaveStatus.NONE);
    setIsNew(!isNew);
  };

  useEffect(() => {
    if (!!props.parkingRule && !!props.parkingRule.id) {
      setIsNew(false);
    }
  }, [props.parkingRule]);

  return (
    <div>
      <div className={styles.header}>
        <h3>Parking Rules</h3>
        <Button type="primary" onClick={toggleNew}>
          {isNew ? "Abort New" : "New"}
        </Button>
      </div>
      {isNew ? null : (
        <ParkingRulePicker
          identifier={props.parkingRule ? props.parkingRule.name : ""}
          onSelect={rule => props.setSelectedParkingRule(rule)}
        />
      )}
      <div style={{ marginBottom: "0.5em" }}></div>
      {!!props.parkingRule ? (
        <ParkingRuleEditor
          del={del}
          save={save}
          saveStatus={saveStatus}
          rule={props.parkingRule}
          isNew={isNew}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (store: Pick<IStore, "rulePage">): IStateToProps => {
  return {
    parkingRule: store.rulePage.selectedParkingRule
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    setSelectedParkingRule: payload =>
      dispatch({
        type: SET_PARKING_RULE,
        payload
      }),
    useUpdateParkingRule: () => useMutation(RULE_PAGE_UPDATE_PARKING_RULE),
    useDeleteParkingRule: () => useMutation(RULE_PAGE_DELETE_PARKING_RULE),
    useCreateParkingRule: () => useMutation(RULE_PAGE_CREATE_PARKING_RULE)
  };
};

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingRuleWidget);

export {
  connected as ParkingRuleWidget,
  ParkingRuleWidget as UnconnectedParkingRuleWdiget
};
