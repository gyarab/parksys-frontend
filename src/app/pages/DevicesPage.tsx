import React, { useMemo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import {
  fetchDevices,
  updateDevice,
  toggleDeviceExpand
} from "../redux/modules/devicesActionCreators";
import { IDevicesState } from "../redux/modules/devicesModule";
import { useTrueFalseUndefined } from "../components/pickers/TrueFalseUndefined";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { DeviceTable } from "../components/DeviceTable";
import { Button } from "../components/Button";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import DeviceRowSubcomponent from "../components/DeviceRowSubcomponent";
import {
  DEVICE_PAGE_CREATE_DEVICE_MUTATION,
  DEVICE_PAGE_DELETE_DEVICE_MUTATION,
  DEVICE_PAGE_UPDATE_CONFIG_MUTATION
} from "../constants/Mutations";
import { ERRORS_SET_PAGE_ERROR } from "../redux/modules/errorsActionCreators";
import { Flag, FlagType } from "../components/Flag";
import { BackgroundChange } from "../components/BackgroundChange";

const coloredStatus = (backgroundColor, textColor = Color.BLACK): any => {
  return {
    textAlign: "center",
    $nest: {
      span: {
        borderRadius: "5px",
        padding: "0.6em",
        backgroundColor,
        color: textColor
      }
    }
  };
};

const classNames = stylesheet({
  negativeStatus: coloredStatus(Color.LIGHT_RED),
  positiveStatus: coloredStatus(Color.AQUAMARINE)
});

export interface IStateToProps {
  translations: {
    devices: string;
    activated: string;
    config: string;
    qrCode: string;
  };
  devices: Omit<IDevicesState, "expandedDevices">;
}

export interface IDispatchToProps {
  fetchDevices: (filter: { name?: string; activated?: boolean }) => void;
  updateDevice: (id: string, update: object) => void;
  useCreateDevice: () => MutationTuple<any, { name: string }>;
  useDeleteDevice: () => MutationTuple<any, { id: string }>;
  useRegenerateActivationPassword: () => MutationTuple<any, { id: string }>;
  toggleExpand: (id: string, isExpanded: boolean) => void;
  useUpdateDeviceConfig: () => MutationTuple<any, { id: string; config: any }>;
  setError: (err: null | string) => void;
}

export interface IProps extends IStateToProps, IDispatchToProps {}

const reloadIntervalSeconds = 15;
const DevicesPage = (props: IProps): JSX.Element => {
  const activatedFilterOptions: [string, string, string] = [
    "true",
    "false",
    "any"
  ];
  const [
    activatedFilterDisplay,
    activateFilter,
    setActivatedFilter
  ] = useTrueFalseUndefined(activatedFilterOptions);

  const [lastReload, setLastReload] = useState(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [createDeviceEffect] = props.useCreateDevice();
  const [deleteDeviceEffect] = props.useDeleteDevice();
  const [
    regenerateActivationPasswordEffect
  ] = props.useRegenerateActivationPassword();

  const fetchDevices = () => {
    props.fetchDevices({ activated: activateFilter });
    setLastReload(new Date());
  };
  useEffect(() => {
    if (!props.devices.loaded) {
      fetchDevices();
    }
  }, [props.devices.loaded]);

  const reloadDiff = (now.getTime() - lastReload.getTime()) / 1000;
  if (reloadDiff >= reloadIntervalSeconds) {
    fetchDevices();
  }

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [props.devices.pending]);

  const createDevice = e => {
    e.preventDefault();
    setName("");
    if (props.devices.devices) {
      createDeviceEffect({ variables: { name } }).then(fetchDevices);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Activated",
        accessor: "activated",
        Cell({
          row: {
            original: { activated }
          }
        }) {
          return (
            <Flag
              text={activated ? "YES" : "NO"}
              type={activated ? FlagType.POSITIVE : FlagType.NEGATIVE}
            />
          );
        }
      },
      {
        Header: "Activated At",
        accessor: "activatedAt",
        Cell({ row }) {
          return row.original.activatedAt == null ? (
            <span style={{ color: Color.LIGHT_GREY }}>never</span>
          ) : (
            new Date(row.original.activatedAt).toLocaleString()
          );
        }
      },
      {
        Header: "Last Contact",
        accessor: "lastContact",
        Cell({ row }) {
          if (!row.original.lastContact)
            return <span style={{ color: Color.LIGHT_GREY }}>never</span>;
          const date = new Date(row.original.lastContact);
          const diffLTMinute = lastReload.getTime() - 60000 <= date.getTime();
          const minutesAgo = (lastReload.getTime() - date.getTime()) / 60000.0;

          return (
            <span
              style={{
                backgroundColor: diffLTMinute ? "" : Color.LIGHT_RED,
                padding: "0.5em"
              }}
            >
              {minutesAgo >= 60
                ? date.toLocaleString()
                : `${Math.round(10 * minutesAgo) / 10} mins ago`}
            </span>
          );
        }
      },
      {
        Header: "Actions",
        Cell({ row }) {
          const detailsClick = () => {
            props.toggleExpand(row.original.id, !row.isExpanded);
            row.toggleExpanded();
          };
          const deleteClick = () => {
            deleteDeviceEffect({ variables: { id: row.original.id } }).then(
              fetchDevices
            );
          };
          return (
            <>
              <Button
                // disabled={row.original.activated && !row.isExpanded}
                onClick={detailsClick}
                style={{ marginRight: "0.5em" }}
              >
                Details
              </Button>
              <Button type="negative" onClick={deleteClick}>
                Delete
              </Button>
            </>
          );
        }
      }
    ],
    [lastReload]
  );

  const [updateConfigEffect] = props.useUpdateDeviceConfig();

  const weHaveDevices = props.devices.loaded && !!props.devices.devices;
  const table = (
    <>
      <DeviceTable
        columns={columns}
        data={weHaveDevices ? props.devices.devices : []}
        renderDeviceSubcomponent={({ row }) => (
          <DeviceRowSubcomponent
            regenerateActivationPasswordEffect={
              regenerateActivationPasswordEffect
            }
            updateConfigEffect={updateConfigEffect}
            device={row.original}
            updateDevice={props.updateDevice}
            toggleExpand={props.toggleExpand}
            setError={props.setError}
          />
        )}
      />
      {weHaveDevices && props.devices.devices.length === 0 ? (
        <p>No Devices Found</p>
      ) : null}
    </>
  );

  return (
    <div>
      <div>
        {/* <label>
          Activated
          <select
            style={{ marginLeft: "0.4em", marginRight: "0.5em" }}
            value={String(activatedFilterDisplay)}
            onChange={event => setActivatedFilter(event.target.value)}
          >
            {activatedFilterOptions.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </label> */}
        <Button disabled={props.devices.pending} onClick={fetchDevices}>
          {`Reload (in ${Math.round(reloadIntervalSeconds - reloadDiff)}s)`}
        </Button>
      </div>

      <hr />
      {table}
      <hr />
      <form onSubmit={createDevice}>
        <label style={{ marginRight: "1em" }}>
          <span style={{ marginRight: "1em" }}>Name</span>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </label>
        <Button onClick={createDevice}>Create</Button>
      </form>
    </div>
  );
};

const componentTranslationsSelector = createSelector(
  translationsSelector,
  translations => {
    const translator: ITranslator = new Translator(translations);
    return {
      devices: translator.translate("Devices"),
      qrCode: translator.translate("QR Code"),
      activated: translator.translate("Activated"),
      config: translator.translate("Config")
    };
  }
);

export const mapStateToProps = (
  state: Pick<IStore, "settings" | "devices">
): IStateToProps => ({
  translations: componentTranslationsSelector(state),
  devices: state.devices
    ? {
        error: state.devices.error,
        loaded: state.devices.loaded,
        pending: state.devices.pending,
        devices: state.devices.devices
      }
    : null
});

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    fetchDevices: filter => dispatch(fetchDevices.invoke({ filter })),
    updateDevice: (id, update) => dispatch(updateDevice({ id, update })),
    useCreateDevice: () => useMutation(DEVICE_PAGE_CREATE_DEVICE_MUTATION),
    useDeleteDevice: () => useMutation(DEVICE_PAGE_DELETE_DEVICE_MUTATION),
    useRegenerateActivationPassword: () =>
      useMutation(gql`
        mutation regenerateActivationPassword($id: ID!) {
          deviceRegenerateActivationPassword(id: $id) {
            activated
            activatedAt
            activationQrUrl
            activationPasswordExpiresAt
          }
        }
      `),
    toggleExpand: (id, isExpanded) =>
      dispatch(toggleDeviceExpand({ id, isExpanded })),
    useUpdateDeviceConfig: () =>
      useMutation(DEVICE_PAGE_UPDATE_CONFIG_MUTATION),
    setError: err => dispatch({ type: ERRORS_SET_PAGE_ERROR, payload: err })
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
