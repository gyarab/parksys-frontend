import React, { useState, useEffect, useMemo } from "react";
import { stylesheet } from "typestyle";
import { useLazyQuery } from "@apollo/react-hooks";
import { Button } from "../Button";

const styles = stylesheet({
  multiModelPicker: {
    position: "relative",
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "4fr 1fr",
    $nest: {
      "> button": {
        width: "5em",
        textAlign: "center"
      },
      ".controls": {
        display: "grid",
        gridTemplateRows: "repeat(2, auto)",
        marginLeft: "0.4em",
        paddingLeft: "0.4em",
        borderLeft: "2px solid #ccc"
      }
    }
  },
  belowInput: {
    position: "absolute",
    top: "0",
    left: "101%",
    zIndex: 100,
    backgroundColor: "white",
    borderRadius: "3px",
    boxShadow: "0px 0px 3px 1px #888",
    padding: "0.5em 0 0.5em 0",
    $nest: {
      "> div": {
        margin: 0,
        $nest: {
          "> div": {
            padding: "0.4em 0.4em 0.4em 0.4em"
          }
        }
      }
    }
  },
  item: {
    display: "grid",
    gridTemplateColumns: "auto 3em", // content and an action
    gridColumnGap: "0.3em",
    $nest: {
      "&+&": {
        borderTop: "1px solid #ccc"
      }
    }
  },
  modelDisplay: {},
  selectedModels: {
    borderRight: "2px solid #ccc",
    minWidth: "15em"
  },
  notSelectedModels: {
    minWidth: "15em"
  },
  searchBox: {
    display: "block",
    width: "calc(100% - 2em)",
    marginLeft: "auto",
    marginRight: "auto"
  },
  empty: {
    color: "#999"
  }
});

interface IGProps<T = any> {
  QUERY: any;
  identifierAndCurrentModelsToOptions: (
    identifier: string,
    models: Array<T>
  ) => any;
  renderModel: (model: T) => JSX.Element;
  arrayGetter: (data) => Array<T>;
  modelToIdentifier: (model: T) => string;
}

interface IProps<T = any> {
  onAdd: (model: T) => void;
  onRemove: (index: number, model: T) => void;
  onClear: () => void;
  models: Array<T>;
  disabled?: boolean;
  initialSearch?: string;
}

export const GenericModelMultiPicker = <T extends unknown = any>(
  gProps: IGProps<T>
) => (props: IProps<T>) => {
  const disabled = props.disabled || false;
  const [loadGql, { data, loading, called, error }] = useLazyQuery(
    gProps.QUERY
  );
  // This value differs from props.licensePlate when the input is focused
  const [searchQuery, setSearchQuery] = useState(props.initialSearch || "");
  const load = () =>
    loadGql(
      gProps.identifierAndCurrentModelsToOptions(searchQuery, props.models)
    );

  const [isOpened, setIsOpened] = useState<boolean>(false);
  useEffect(() => {
    if (isOpened) load();
  }, [searchQuery, called]);

  const toggle = () => {
    setIsOpened(!isOpened);
    if (!isOpened) {
      // isOpened is set to be true
      load();
    }
  };

  const selectedSet = useMemo(
    () =>
      new Set<string>(
        props.models.map(model => gProps.modelToIdentifier(model))
      ),
    [props.models]
  );
  const fetchedSet = useMemo(
    () =>
      !!data
        ? new Set<string>(
            gProps
              .arrayGetter(data)
              .map(model => gProps.modelToIdentifier(model))
          )
        : new Set<string>(),
    [data]
  );
  const notSelectedSet = useMemo(() => {
    const notSelected = new Set<string>();
    fetchedSet.forEach(identifier => {
      if (!selectedSet.has(identifier)) notSelected.add(identifier);
    });
    return notSelected;
  }, [selectedSet, fetchedSet]);

  const onAdd = (model: T) => {
    props.onAdd(model);
  };
  const onRemove = (index: number, model: T) => {
    props.onRemove(index, model);
  };

  const itemRender = (item: JSX.Element, action?: JSX.Element) => {
    return (
      <div style={{ display: "grid" }} className={styles.item}>
        <div>{item}</div>
        {action}
      </div>
    );
  };
  const summaryItem = (item: JSX.Element, action?: JSX.Element) => {
    return (
      <div style={{ display: "grid" }} className={styles.item}>
        {item}
        {action}
      </div>
    );
  };
  const belowInput = isOpened ? (
    <div className={styles.belowInput}>
      <div className={styles.modelDisplay}>
        <input
          className={styles.searchBox}
          placeholder="Search"
          type="text"
          disabled={disabled}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className={styles.notSelectedModels}>
          {loading ? (
            <p>Loading</p>
          ) : error ? (
            <span>{error.toString()}</span>
          ) : notSelectedSet.size === 0 ? (
            <p className={styles.empty}>Empty</p>
          ) : (
            gProps
              .arrayGetter(data)
              .filter(model =>
                notSelectedSet.has(gProps.modelToIdentifier(model))
              )
              .map(model =>
                itemRender(
                  gProps.renderModel(model),
                  <button onClick={() => onAdd(model)}>+</button>
                )
              )
          )}
        </div>
      </div>
    </div>
  ) : null;
  return (
    <div className={styles.multiModelPicker}>
      <div className="selectedModels">
        {props.models.map((model, i) =>
          summaryItem(
            gProps.renderModel(model),
            <button onClick={() => onRemove(i, model)}>x</button>
          )
        )}
        {props.models.length === 0 ? (
          <span className={styles.empty}>Empty</span>
        ) : null}
      </div>
      <div className="controls">
        <Button onClick={() => toggle()}>{isOpened ? "<<" : ">>"}</Button>
        <Button
          type="negative"
          disabled={disabled}
          onClick={() => {
            props.onClear();
          }}
        >
          X
        </Button>
      </div>
      {belowInput}
    </div>
  );
};

export const useGenericMultiPickerFromMultiPicker = <T extends unknown = any>(
  PickerInstance: (props: IProps<T>) => JSX.Element
) => {
  return ({
    initialModels,
    initialSearch,
    disabled
  }: {
    initialModels?: Array<T>;
    initialSearch?: string;
    disabled?: boolean;
  }) => {
    const [models, setModels] = useState<any | null>(initialModels || []);
    const render = (
      <PickerInstance
        models={models}
        initialSearch={initialSearch || ""}
        onAdd={model => setModels(models.concat([model]))}
        onRemove={i => {
          models.splice(i, 1);
          setModels(new Array(...models));
        }}
        onClear={() => setModels([])}
        disabled={disabled || false}
      />
    );
    return [render, models, setModels];
  };
};

export const useGenericMultiPicker = <T extends unknown = any>(
  gProps: IGProps<T>
) => {
  const PickerInstance = GenericModelMultiPicker(gProps);
  return useGenericMultiPickerFromMultiPicker(PickerInstance);
};
