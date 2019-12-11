import React, { useMemo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import { fetchDevices } from "../redux/modules/devicesActionCreators";
import { IDevicesState } from "../redux/modules/devicesModule";
import { useTrueFalseUndefined } from "../components/TrueFalseUndefined";
import imageGetter from "../helpers/imageGetter";
import { useMutation, MutationTuple } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeviceTable from "../components/DeviceTable";
import { Button } from "../components/Button";

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
  useCreateDevice: () => MutationTuple<any, { name: string }>;
}

interface IProps extends IStateToProps, IDispatchToProps {}

const DeviceRowSubcomponent = ({ device }) => {
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

  if (imageData == null) {
    return <div>Loading QR Code...</div>;
  } else {
    return <img src={imageData}></img>;
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
  const [addDevice] = props.useCreateDevice();

  const fetchDevices = () => {
    props.fetchDevices({ activated: activateFilter });
  };

  const createDevice = e => {
    e.preventDefault();
    if (props.devices.devices) {
      addDevice({ variables: { name } }).then(fetchDevices);
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
        accessor: "activated"
      },
      {
        Header: "Activated At",
        accessor: "activatedAt"
      },
      {
        Header: "Actions",
        Cell({ row }) {
          const onClick = () => {
            row.toggleExpanded();
          };
          return (
            <>
              <Button onClick={onClick}>Details</Button>
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
          <DeviceRowSubcomponent device={row.original} />
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
    useCreateDevice: () =>
      useMutation(gql`
        mutation addDevice($name: String!) {
          addDevice(input: { name: $name }) {
            id
            name
            activationQrUrl
          }
        }
      `)
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };