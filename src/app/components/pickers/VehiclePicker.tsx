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
  onSelect: (vehicle: { licensePlate: string; id: string }) => void;
  licensePlate: string;
  disabled?: boolean;
}

export const VehiclePicker = (props: IProps) => {
  const disabled = props.disabled || false;
  const [loadVehicles, { data, loading, called, error }] = useLazyQuery(
    VEHICLE_PICKER_SEARCH_QUERY
  );
  // This value differs from props.licensePlate when the input is focused
  const [localLicensePlate, setLocalLicensePlate] = useState();
  // Accept the value passed from parent
  useEffect(() => setLocalLicensePlate(props.licensePlate), [
    props.licensePlate
  ]);
  const load = () => {
    loadVehicles({
      variables: { licensePlate: props.licensePlate }
    });
  };

  useEffect(() => {
    if (called) load();
  }, [localLicensePlate, called]);
  const [focused, setFocused] = useState<boolean>(false);
  // Input event handlers
  const onEditing = () => {
    setFocused(true);
    if (!called) load();
  };
  const onStopEditing = () => {
    setFocused(false);
    setLocalLicensePlate(props.licensePlate);
  };
  // Below Input event handlers
  const [selecting, setSelecting] = useState<boolean>(false);
  const onSelecting = () => setSelecting(true);
  const onStopSelecting = () => setSelecting(false);
  const onSelect = (vehicle: any) => {
    setSelecting(false);
    props.onSelect(vehicle);
  };
  const belowInput =
    focused || selecting ? (
      <div className={styles.belowInput}>
        {loading ? (
          <span>Loading</span>
        ) : error ? (
          <span>{error.toString()}</span>
        ) : (
          <div onMouseOver={onSelecting} onMouseLeave={onStopSelecting}>
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
        placeholder="Search"
        type="text"
        disabled={disabled}
        value={localLicensePlate}
        onChange={e => setLocalLicensePlate(e.target.value)}
        onFocus={onEditing}
        onBlur={onStopEditing}
      />
      {belowInput}
      <button
        disabled={disabled}
        onClick={() => {
          props.onSelect(null);
        }}
      >
        X
      </button>
    </div>
  );
};
