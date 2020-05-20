import React, { useState, useEffect } from "react";
import { Button } from "../../Button";
import { Color } from "../../../constants";
import { stylesheet, classes } from "typestyle";
import { useQuery } from "@apollo/react-hooks";

const styles = stylesheet({
  pagingControl: {
    display: "grid",
    gridTemplateColumns: "auto auto",
  },
  modelListPicker: {
    border: `1px solid ${Color.LIGHT_GREY}`,
    padding: "0.6em",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    $nest: {
      ".searchBox": {
        // flex: "0 1 4em",
        $nest: {
          button: {
            marginLeft: "0.3em",
          },
        },
      },
      ".selectedModel": {
        marginTop: "0.2em",
        padding: "0.1em 0 0.1em 0.5em",
        backgroundColor: `#ddd`,
        flex: "0 1 auto",
      },
      ".modelList": {
        marginTop: "0.2em",
        overflowY: "auto",
        flex: "1 1 auto",
      },
    },
  },
  modelList: {
    $nest: {
      "div + div": {
        borderTop: `1px solid ${Color.LIGHT_GREY}`,
      },
      div: {
        height: "auto",
        paddingBottom: "0.1em",
        paddingLeft: "0.2em",
        $nest: {
          "&:hover": {
            backgroundColor: "#eee",
          },
        },
      },
    },
  },
  empty: {
    color: "#999",
  },
});

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
  clearableIdentifier?: boolean;
  paging?: boolean;
  showSelection?: boolean;
  // 0 for never, min value > 0 is 500
  refetchIntervalMs?: number;
}

interface IListProps {
  onSelect: (obj: any) => void;
  model: any;
  disabled?: boolean;
  options?: any;
}

const ModelList = ({ loading, error, renderModel, data, onSelect }) => {
  return error ? (
    <p>{error.toString()}</p>
  ) : !data ? (
    <div>Loading </div>
  ) : data.length === 0 ? (
    <div className={classes(styles.empty, styles.modelList)}>Empty</div>
  ) : (
    <div className={styles.modelList}>
      {data.map((model, i) => (
        <div key={i} onClick={() => onSelect(model)}>
          {renderModel(model)}
        </div>
      ))}
    </div>
  );
};

const isEmpty = (v: any, def: any) => (typeof v === "undefined" ? def : v);

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
  const clearIdentifierOnSelect = isEmpty(gProps.clearIdentifierOnSelect, true);
  const paging = isEmpty(gProps.paging, false);
  const showSelection = isEmpty(gProps.showSelection, true);
  const refetchIntervalMs = isEmpty(gProps.refetchIntervalMs, 0);
  const clearableIdentifier = isEmpty(gProps.clearableIdentifier, false);
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
        ...(props.options || { variables: {} }).variables,
      },
    };
    const { loading, error, data, refetch } = useQuery(gProps.QUERY, options);
    const onSelect = (model: any) => {
      props.onSelect(model);
      if (clearIdentifierOnSelect) {
        setIdentifier("");
      }
    };
    useEffect(() => {
      // Prevent too frequent refreshes
      if (refetchIntervalMs < 500) return;
      const interval = setInterval(() => {
        refetch();
      }, refetchIntervalMs);
      return () => {
        clearInterval(interval);
      };
    }, [identifier]);

    const arr = !!data ? gProps.arrayGetter(data) : [];
    return (
      <div className={styles.modelListPicker}>
        <div className="searchBox">
          <InputComponent
            key={0}
            value={identifier}
            disabled={disabled}
            onChange={(e) => {
              setPage(1);
              setIdentifier(e.target.value);
            }}
          />
          {clearableIdentifier ? (
            <Button
              disabled={disabled}
              onClick={() => {
                props.onSelect(null);
              }}
              type="negative"
            >
              X
            </Button>
          ) : null}
          {showSelection ? (
            <div className="selectedModel">
              {!!props.model ? (
                gProps.renderModel(props.model)
              ) : (
                <span style={{ color: Color.GREY }}>
                  No {!gProps.modelName ? "model" : gProps.modelName} selected
                </span>
              )}
            </div>
          ) : null}
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
        onSelect={(model) => {
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
