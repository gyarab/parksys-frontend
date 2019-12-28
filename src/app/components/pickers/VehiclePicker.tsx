import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import { useLazyQuery } from "@apollo/react-hooks";
import { VEHICLE_PICKER_SEARCH_QUERY } from "../../constants/Queries";

const styles = stylesheet({
  vehiclePicker: {
    position: "relative",
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "repeat(2, auto)",
    $nest: {
      input: {
        float: "right"
      },
      button: {
        width: "3em",
        textAlign: "center",
        paddingLeft: 0
      }
    }
  },
  belowInput: {
    position: "absolute",
    top: "2.0em",
    right: "3.2em",
    zIndex: 100,
    backgroundColor: "white",
    borderRadius: "3px",
    boxShadow: "0px 0px 3px 1px #888",
    padding: "0.5em 0 0.5em 0",
    $nest: {
      div: {
        margin: 0,
        $nest: {
          span: {
            display: "block",
            padding: "0.4em",
            $nest: {
              "&:hover": {
                backgroundColor: "#CCC"
              }
            }
          }
        }
      }
    }
  }
});

interface IProps {
  onInputChange: (licensePlate: string) => void;
  onSelect: (vehicle: { licensePlate: string; id: string }) => void;
  licensePlate: string;
  disabled?: boolean;
}

export const VehiclePicker = (props: IProps) => {
  const disabled = props.disabled || false;
  const [loadVehicles, { data, loading, called, error }] = useLazyQuery(
    VEHICLE_PICKER_SEARCH_QUERY
  );
  const load = () => {
    loadVehicles({
      variables: { licensePlate: props.licensePlate }
    });
  };
  useEffect(() => {
    load();
  }, [props.licensePlate]);
  const [focused, setFocused] = useState<boolean>(false);
  // Input event handlers
  const onFocus = () => {
    setFocused(true);
    if (!called) load();
  };
  const onUnfocus = () => {
    setFocused(false);
  };
  // Below Input event handlers
  const [belowInputMouse, setBelowInputMouse] = useState<boolean>(false);
  const onBelowMouseOver = () => setBelowInputMouse(true);
  const onBelowMouseLeave = () => setBelowInputMouse(false);
  const onSelect = (vehicle: any) => {
    setBelowInputMouse(false);
    props.onSelect(vehicle);
  };
  const belowInput =
    focused || belowInputMouse ? (
      <div className={styles.belowInput}>
        {loading ? (
          <span>Loading</span>
        ) : error ? (
          <span>{error.toString()}</span>
        ) : (
          <div onMouseOver={onBelowMouseOver} onMouseLeave={onBelowMouseLeave}>
            {data.vehicleSearch.data.map(vehicle => (
              <span onClick={() => onSelect(vehicle)}>
                {vehicle.licensePlate}
              </span>
            ))}
          </div>
        )}
      </div>
    ) : null;
  return (
    <div className={styles.vehiclePicker}>
      <input
        type="text"
        disabled={disabled}
        value={props.licensePlate}
        onChange={e => props.onInputChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onUnfocus}
      />
      {belowInput}
      <button
        disabled={disabled}
        onClick={() => {
          props.onInputChange("");
          props.onSelect(null);
        }}
      >
        X
      </button>
    </div>
  );
};
