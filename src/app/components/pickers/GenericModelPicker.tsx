import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import { useLazyQuery } from "@apollo/react-hooks";

const styles = stylesheet({
  modelPicker: {
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
          div: {
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

interface IGProps {
  onSelect: (obj: any) => void;
  identifier: string;
  disabled?: boolean;
}

export const GenericModelPicker = (
  QUERY: any,
  identifierToOptions: (identifier: string) => any,
  renderModel: (model: any) => JSX.Element,
  arrayGetter: (data) => Array<any>
) => (props: IGProps) => {
  const disabled = props.disabled || false;
  const [loadGql, { data, loading, called, error }] = useLazyQuery(QUERY);
  // This value differs from props.licensePlate when the input is focused
  const [identifier, setIdentifier] = useState();
  // Accept the value passed from parent
  useEffect(() => setIdentifier(props.identifier), [props.identifier]);
  const load = () => loadGql(identifierToOptions(identifier));

  useEffect(() => {
    if (called) load();
  }, [identifier, called]);
  const [focused, setFocused] = useState<boolean>(false);
  // Input event handlers
  const onEditing = () => {
    setFocused(true);
    if (!called) load();
  };
  const onStopEditing = () => {
    setFocused(false);
    setIdentifier(props.identifier);
  };
  // Below Input event handlers
  const [selecting, setSelecting] = useState<boolean>(false);
  const onSelecting = () => setSelecting(true);
  const onStopSelecting = () => setSelecting(false);
  const onSelect = (model: any) => {
    setSelecting(false);
    props.onSelect(model);
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
            {arrayGetter(data).map(model => (
              <div onClick={() => onSelect(model)}>{renderModel(model)}</div>
            ))}
          </div>
        )}
      </div>
    ) : null;
  return (
    <div className={styles.modelPicker}>
      <input
        placeholder="Search"
        type="text"
        disabled={disabled}
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
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
