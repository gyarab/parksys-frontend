import * as React from "react";
import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import {
  fetchDevices,
  createDevice,
  CreateDeviceInvoke
} from "../redux/modules/devicesActionCreators";
import { IDevicesState } from "../redux/modules/devicesModule";
import { useTrueFalseUndefined } from "../components/TrueFalseUndefined";
import imageGetter from "../helpers/imageGetter";

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
  createDevice: (input: CreateDeviceInvoke) => void;
}

interface IProps extends IStateToProps, IDispatchToProps {}

const devicesShown = {};

const DeviceDetail = ({ device }): JSX.Element => {
  const [imageData, setImageData] = useState(null);
  const [imageVisible, setImageVisible] = useState(devicesShown[device.id]);

  const showQrCode = () => {
    devicesShown[device.id] = true;
    if (imageData) {
      setImageVisible(true);
      return;
    }
    imageGetter(device.activationQrUrl)
      .then(response => response.blob())
      .then(blob => {
        setImageData(URL.createObjectURL(blob));
        setImageVisible(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const hideQrCode = () => {
    setImageVisible(false);
    devicesShown[device.id] = false;
  };

  if (imageVisible && imageData == null) {
    showQrCode();
  }

  const button = imageVisible ? (
    <button onClick={hideQrCode}>Hide QR Code</button>
  ) : (
    <button onClick={showQrCode}>Show QR Code</button>
  );
  const image = imageVisible ? <img src={imageData} /> : null;

  return (
    <div>
      <span>{JSON.stringify(device)}</span>
      {button}
      <div>{image}</div>
    </div>
  );
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

  const [name, setName] = React.useState("");

  let devicesDisplay = null;
  if (props.devices.loaded && props.devices.error === "") {
    devicesDisplay = props.devices.devices.map(device => (
      <Fragment key={device.id}>
        <DeviceDetail device={device} />
      </Fragment>
    ));
  }

  const fetchDevices = () => {
    props.fetchDevices({ activated: activateFilter });
  };

  const createDevice = e => {
    e.preventDefault();
    props.createDevice({ input: { name } });
  };

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
        <button disabled={props.devices.pending} onClick={fetchDevices}>
          Fetch Devices
        </button>
        <div>{devicesDisplay}</div>
      </div>
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
    createDevice: input => dispatch(createDevice.invoke(input))
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
