import React, { useMemo, useState } from "react";
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
import { useTrueFalseUndefined } from "../components/TrueFalseUndefined";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { DeviceTable } from "../components/DeviceTable";
import { Button } from "../components/Button";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import DeviceRowSubcomponent from "../components/DeviceRowSubcomponent";
import {
  DEVICE_PAGE_CREATE_DEVICE_MUTATION,
  DEVICE_PAGE_DELETE_DEVICE_MUTATION
} from "../constants/Mutations";

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
}

export interface IProps extends IStateToProps, IDispatchToProps {}

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

  const [name, setName] = useState("");
  const [createDeviceEffect] = props.useCreateDevice();
  const [deleteDeviceEffect] = props.useDeleteDevice();
  const [
    regenerateActivationPasswordEffect
  ] = props.useRegenerateActivationPassword();

  const fetchDevices = () => {
    props.fetchDevices({ activated: activateFilter });
  };

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
          const cls = activated
            ? classNames.positiveStatus
            : classNames.negativeStatus;
          const text = activated ? "YES" : "NO";
          return (
            <div className={cls}>
              <span>{text}</span>
            </div>
          );
        }
      },
      {
        Header: "Activated At",
        accessor: "activatedAt",
        Cell({ row }) {
          return row.original.activatedAt == null
            ? null
            : row.original.activatedAt;
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
                disabled={row.original.activated && !row.isExpanded}
                onClick={detailsClick}
              >
                Details
              </Button>
              <Button type={"secondary"} onClick={deleteClick}>
                Delete
              </Button>
            </>
          );
        }
      }
    ],
    []
  );

  const table = (
    <>
      <DeviceTable
        columns={columns}
        data={props.devices.loaded ? props.devices.devices : []}
        renderDeviceSubcomponent={({ row }) => (
          <DeviceRowSubcomponent
            regenerateActivationPasswordEffect={
              regenerateActivationPasswordEffect
            }
            device={row.original}
            updateDevice={props.updateDevice}
          />
        )}
      />
      {props.devices.loaded && props.devices.devices.length === 0 ? (
        <p>No Devices Found</p>
      ) : null}
    </>
  );

  return (
    <div>
      <div>
        <label>
          Activated
          <select
            value={String(activatedFilterDisplay)}
            onChange={event => setActivatedFilter(event.target.value)}
          >
            {activatedFilterOptions.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </label>
        <Button disabled={props.devices.pending} onClick={fetchDevices}>
          Fetch Devices
        </Button>
      </div>

      <hr />
      {table}
      <hr />
      <form onSubmit={createDevice}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </label>
        <input type="submit" value="Create" />
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
      dispatch(toggleDeviceExpand({ id, isExpanded }))
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
