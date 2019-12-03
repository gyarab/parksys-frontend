import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { createSelector } from "reselect";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import { fetchDevices } from "../redux/modules/devicesActionCreators";
import { IDevicesState } from "../redux/modules/devicesModule";

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
  fetchDevices: (input: { name?: string; activated?: boolean }) => void;
}

interface IProps extends IStateToProps, IDispatchToProps {}

const DevicesPage = (props: IProps): JSX.Element => {
  let devicesDisplay = null;
  if (props.devices.loaded && props.devices.error === "") {
    devicesDisplay = props.devices.devices.map(device => (
      <div key={device.id}>
        <p>
          [{device.id}] => {device.name} -{" "}
          {device.activated ? props.translations.activated : "INACTIVE"}
        </p>
      </div>
    ));
  }
  return (
    <div>
      <button onClick={() => props.fetchDevices({ name: "lg" })}>
        Fetch Devices
      </button>
      <div>{devicesDisplay}</div>
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
    fetchDevices: input => dispatch(fetchDevices.invoke(input))
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
