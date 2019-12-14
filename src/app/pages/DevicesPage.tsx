import React, { useMemo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import {
  fetchDevices,
  updateDevice
} from "../redux/modules/devicesActionCreators";
import { IDevicesState } from "../redux/modules/devicesModule";
import { useTrueFalseUndefined } from "../components/TrueFalseUndefined";
import imageGetter from "../helpers/imageGetter";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeviceTable from "../components/DeviceTable";
import { Button } from "../components/Button";
import { stylesheet } from "typestyle";
import { Color } from "../constants";

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

interface IStateToProps {
  translations: {
    devices: string;
    activated: string;
    config: string;
    qrCode: string;
  };
  devices: IDevicesState;
}

interface IDispatchToProps {
  fetchDevices: (filter: { name?: string; activated?: boolean }) => void;
  updateDevice: (id: string, update: object) => void;
  useCreateDevice: () => MutationTuple<any, { name: string }>;
  useDeleteDevice: () => MutationTuple<any, { id: string }>;
  useRegenerateActivationPassword: () => MutationTuple<any, { id: string }>;
}

interface IProps extends IStateToProps, IDispatchToProps {}

const DeviceRowSubcomponent = ({
  regenerateActivationPasswordEffect,
  device
}) => {
  console.log("SUBCOMP RERENDER");
  const [imageData, setImageData] = useState(null);
  useEffect(() => {
    imageGetter(device.activationQrUrl)
      .then(response => response.blob())
      .then(blob => {
        setImageData(URL.createObjectURL(blob));
      })
      .catch(err => {
        console.log(err);
      });
    return () => {
      setImageData(null);
    };
  }, []);

  const expiration = new Date(device.activationPasswordExpiresAt);
  const expired = expiration.getTime() <= new Date().getTime();
  const onRegenerateClick = () => {
    regenerateActivationPasswordEffect(device.id);
  };
  if (imageData == null) {
    return <div>Loading QR Code...</div>;
  } else if (expired) {
    <div>
      <span>Activation Qr code has expired.</span>
      <Button onClick={onRegenerateClick}>
        Regenerate Activation Password
      </Button>
      ;
    </div>;
  } else {
    return (
      <div>
        <span style={{ display: "block" }}>
          Activation expires at{" "}
          <u>
            {expiration.toLocaleDateString("cs")}{" "}
            {expiration.toLocaleTimeString("cs")}
          </u>
        </span>
        <img src={imageData}></img>
        <Button onClick={onRegenerateClick}>
          Regenerate Activation Password
        </Button>
      </div>
    );
  }
};

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
        accessor: "activatedAt"
      },
      {
        Header: "Actions",
        Cell({ row }) {
          const detailsClick = () => {
            row.toggleExpanded();
          };
          const deleteClick = () => {
            deleteDeviceEffect({ variables: { id: row.original.id } }).then(
              fetchDevices
            );
          };
          return (
            <>
              <Button onClick={detailsClick}>Details</Button>
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
            regenerateActivationPasswordEffect={id => {
              regenerateActivationPasswordEffect({ variables: { id } }).then(
                result => {
                  console.log(result);
                  props.updateDevice(
                    id,
                    result.data.deviceRegenerateActivationPassword
                  );
                }
              );
            }}
            device={row.original}
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
});

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  return {
    fetchDevices: filter => dispatch(fetchDevices.invoke({ filter })),
    updateDevice: (id, update) => dispatch(updateDevice({ id, update })),
    useCreateDevice: () =>
      useMutation(gql`
        mutation createDevice($name: String!) {
          createDevice(input: { name: $name }) {
            id
            name
            activationQrUrl
          }
        }
      `),
    useDeleteDevice: () =>
      useMutation(gql`
        mutation deleteDevice($id: ID!) {
          deleteDevice(id: $id) {
            id
          }
        }
      `),
    useRegenerateActivationPassword: () =>
      useMutation(gql`
        mutation regenerateActivationPassword($id: ID!) {
          deviceRegenerateActivationPassword(id: $id) {
            activationQrUrl
            activationPasswordExpiresAt
          }
        }
      `)
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
