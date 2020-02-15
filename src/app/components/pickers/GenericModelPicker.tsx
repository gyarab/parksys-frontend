import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Color } from "../../constants";

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
  },
  modelListPicker: {
    border: `1px solid ${Color.LIGHT_GREY}`,
    padding: "0.6em",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    $nest: {
      ".searchBox": {
        flex: "0 1 4em"
      },
      ".selectedModel": {
        marginTop: "0.2em",
        padding: "0.1em 0 0.1em 0.5em",
        backgroundColor: `#ddd`,
        flex: "0 1 auto"
      },
      ".modelList": {
        marginTop: "0.2em",
        overflowY: "auto",
        flex: "1 1 auto"
      }
    }
  },
  modelList: {
    $nest: {
      "div + div": {
        borderTop: `1px solid ${Color.LIGHT_GREY}`
      },
      div: {
        height: "auto",
        paddingBottom: "0.1em",
        paddingLeft: "0.2em",
        $nest: {
          "&:hover": {
            backgroundColor: "#eee"
          }
        }
      }
    }
  }
});

interface IProps {
  onSelect: (obj: any) => void;
  identifier: string;
  disabled?: boolean;
}

interface IGProps {
  QUERY: any;
  identifierToOptions: (identifier: string) => any;
  renderModel: (model: any) => JSX.Element;
  arrayGetter: (data) => Array<any>;
}

const PopUp = ({
  loading,
  error,
  onSelecting,
  gProps: { arrayGetter, renderModel },
  data,
  onStopSelecting,
  onSelect
}) => {
  return loading ? (
    <span>Loading</span>
  ) : error ? (
    <span>{error.toString()}</span>
  ) : (
    <div onMouseOver={onSelecting} onMouseLeave={onStopSelecting}>
      {arrayGetter(data).map(model => (
        <div onClick={() => onSelect(model)}>{renderModel(model)}</div>
      ))}
    </div>
  );
};

export const GenericModelPicker = (gProps: IGProps) => (props: IProps) => {
  const disabled = props.disabled || false;
  const [loadGql, { data, loading, called, error }] = useLazyQuery(
    gProps.QUERY
  );
  // This value differs from props.licensePlate when the input is focused
  const [identifier, setIdentifier] = useState("");
  // Accept the value passed from parent
  useEffect(() => setIdentifier(props.identifier), [props.identifier]);
  const load = () => loadGql(gProps.identifierToOptions(identifier));

  useEffect(() => {
    if (called) load();
  }, [identifier, called]);
  const [focused, setFocused] = useState<boolean>(false);
  const onEditing = () => {
    setFocused(true);
    if (!called) load();
  };
  const [selecting, setSelecting] = useState<boolean>(false);
  const onSelecting = () => setSelecting(true);
  const onStopSelecting = () => {
    setSelecting(false);
    if (!focused) {
      setIdentifier(props.identifier);
    }
  };
  const onSelect = (model: any) => {
    setSelecting(false);
    props.onSelect(model);
  };
  const onStopEditing = () => {
    setFocused(false);
    if (!selecting) {
      setIdentifier(props.identifier);
    }
  };

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
      <button
        disabled={disabled}
        onClick={() => {
          props.onSelect(null);
        }}
      >
        X
      </button>
      {focused || selecting ? (
        <div className={styles.belowInput}>
          <PopUp
            loading={loading}
            onSelect={onSelect}
            data={data}
            gProps={gProps}
            onStopSelecting={onStopSelecting}
            error={error}
            onSelecting={onSelecting}
          />
        </div>
      ) : null}
    </div>
  );
};

export const useGenericPickerFromPicker = (
  PickerInstance: (props: IProps) => JSX.Element,
  identifierFromModel: (model: any) => string
) => {
  return (disabled: boolean = false, defaultModel: any | null = null) => {
    const [model, setModel] = useState<any | null>(defaultModel);
    const render = (
      <PickerInstance
        identifier={!!model ? identifierFromModel(model) : ""}
        onSelect={model => {
          setModel(model);
        }}
        disabled={disabled}
      />
    );
    return [render, model, setModel];
  };
};

export const useGenericPicker = (
  gProps: IGProps,
  identifierFromModel: (model: any) => string
) => {
  const PickerInstance = GenericModelPicker(gProps);
  return useGenericPickerFromPicker(PickerInstance, identifierFromModel);
};

interface IListProps {
  onSelect: (obj: any) => void;
  model: any;
  disabled?: boolean;
}

const ModelList = ({
  loading,
  error,
  gProps: { arrayGetter, renderModel },
  data,
  onSelect
}) => {
  return loading ? (
    <span>Loading</span>
  ) : error ? (
    <span>{error.toString()}</span>
  ) : (
    <div className={styles.modelList}>
      {arrayGetter(data).map(model => (
        <div onClick={() => onSelect(model)}>{renderModel(model)}</div>
      ))}
    </div>
  );
};

export const GenericModelListPicker = (gProps: IGProps) => (
  props: IListProps
) => {
  const disabled = props.disabled || false;
  const [identifier, setIdentifier] = useState("");
  const { loading, error, data } = useQuery(gProps.QUERY, {
    variables: { query: identifier }
  });
  const onSelect = (model: any) => {
    props.onSelect(model);
    setIdentifier("");
  };

  return (
    <div className={styles.modelListPicker}>
      <div className="searchBox">
        <input
          placeholder="Search"
          type="text"
          disabled={disabled}
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
        />
        <button
          disabled={disabled}
          onClick={() => {
            props.onSelect(null);
          }}
        >
          X
        </button>
        <div className="selectedModel">
          {!!props.model ? (
            gProps.renderModel(props.model)
          ) : (
            <span style={{ color: Color.GREY }}>No model selected</span>
          )}
        </div>
      </div>

      <div className="modelList">
        <ModelList
          loading={loading}
          onSelect={onSelect}
          data={data}
          gProps={gProps}
          error={error}
        />
      </div>
    </div>
  );
};

export const useGenericListPickerFromListPicker = (
  PickerInstance: (props: IListProps) => JSX.Element
) => {
  return (disabled: boolean = false, defaultModel: any | null = null) => {
    const [model, setModel] = useState<any | null>(defaultModel);
    const render = (
      <PickerInstance
        model={!!model ? model : null}
        onSelect={model => {
          setModel(model);
        }}
        disabled={disabled}
      />
    );
    return [render, model, setModel];
  };
};

export const useGenericListPicker = (gProps: IGProps) => {
  const PickerInstance = GenericModelListPicker(gProps);
  return useGenericListPickerFromListPicker(PickerInstance);
};
