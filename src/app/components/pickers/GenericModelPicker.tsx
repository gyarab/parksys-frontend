import React, { useState, useEffect, useMemo, ComponentClass } from "react";
import { stylesheet } from "typestyle";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Color } from "../../constants";
import { Button } from "../Button";

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
        flex: "0 1 4em",
        $nest: {
          button: {
            marginLeft: "0.3em"
          }
        }
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
  },
  pagingControl: {
    display: "grid",
    gridTemplateColumns: "auto auto"
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
  renderModel: (props: { model: any }) => JSX.Element;
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
      <Button
        disabled={disabled}
        onClick={() => {
          props.onSelect(null);
        }}
        type="negative"
      >
        X
      </Button>
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

interface IListInputProps {
  disabled?: boolean;
  onChange: (value) => void;
  value: string;
}

interface IGListProps {
  QUERY: any;
  identifierToOptions: (identifier: string, page?: number) => any;
  input?: (props: IListInputProps) => JSX.Element;
  renderModel: ((props: { model: any }) => JSX.Element) | any;
  arrayGetter: (data) => Array<any>;
  modelName?: string;
  clearIdentifierOnSelect?: boolean;
  paging?: boolean;
}

interface IListProps {
  onSelect: (obj: any) => void;
  model: any;
  disabled?: boolean;
  options?: any;
}

const ModelList = ({ loading, error, renderModel, data, onSelect }) => {
  return loading ? (
    <span>Loading</span>
  ) : error ? (
    <span>{error.toString()}</span>
  ) : (
    <div className={styles.modelList}>
      {data.map(model => (
        <div onClick={() => onSelect(model)}>{renderModel(model)}</div>
      ))}
    </div>
  );
};

export const GenericModelListPicker = (gProps: IGListProps) => {
  const InputComponent = !gProps.input
    ? ({ onChange, disabled, value }) => (
        <input
          placeholder="Search"
          type="text"
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      )
    : gProps.input;
  const clearIdentifierOnSelect =
    typeof gProps.clearIdentifierOnSelect === "undefined"
      ? true
      : gProps.clearIdentifierOnSelect;
  const paging = typeof gProps.paging === "undefined" ? false : gProps.paging;
  return (props: IListProps) => {
    const disabled = props.disabled || false;
    const [identifier, setIdentifier] = useState("");
    const [page, setPage] = useState(1);
    const options = {
      ...gProps.identifierToOptions(identifier, page),
      ...(props.options || {}),
      variables: {
        ...(gProps.identifierToOptions(identifier, page) || { variables: {} })
          .variables,
        ...(props.options || { variables: {} }).variables
      }
    };
    const { loading, error, data } = useQuery(gProps.QUERY, options);
    const onSelect = (model: any) => {
      props.onSelect(model);
      if (clearIdentifierOnSelect) {
        setIdentifier("");
      }
    };

    const arr = !!data ? gProps.arrayGetter(data) : [];
    return (
      <div className={styles.modelListPicker}>
        <div className="searchBox">
          <InputComponent
            key={0}
            value={identifier}
            disabled={disabled}
            onChange={e => {
              setPage(1);
              setIdentifier(e.target.value);
            }}
          />
          <Button
            disabled={disabled}
            onClick={() => {
              props.onSelect(null);
            }}
            type="negative"
          >
            X
          </Button>
          <div className="selectedModel">
            {!!props.model ? (
              gProps.renderModel(props.model)
            ) : (
              <span style={{ color: Color.GREY }}>
                No {!gProps.modelName ? "model" : gProps.modelName} selected
              </span>
            )}
          </div>
        </div>

        <div className="modelList">
          <ModelList
            loading={loading}
            onSelect={onSelect}
            data={arr}
            renderModel={gProps.renderModel}
            error={error}
          />
        </div>
        {paging ? (
          <div className={styles.pagingControl}>
            <button onClick={() => setPage(Math.max(1, page - 1))}>
              {"<"}
            </button>
            <button onClick={() => arr.length > 0 && setPage(page + 1)}>
              {">"}
            </button>
          </div>
        ) : null}
      </div>
    );
  };
};

export const useGenericListPickerFromListPicker = (
  PickerInstance: (props: IListProps) => JSX.Element
) => {
  return (
    options = {},
    disabled: boolean = false,
    defaultModel: any | null = null
  ) => {
    const [model, setModel] = useState<any | null>(defaultModel);
    const render = (
      <PickerInstance
        model={!!model ? model : null}
        onSelect={model => {
          setModel(model);
        }}
        disabled={disabled}
        options={options}
      />
    );
    return [render, model, setModel];
  };
};

export const useGenericListPicker = (gProps: IGListProps) => {
  const PickerInstance = GenericModelListPicker(gProps);
  return useGenericListPickerFromListPicker(PickerInstance);
};
