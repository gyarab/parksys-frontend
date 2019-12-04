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
import { useTrueFalseUndefined } from "../components/TrueFalseUndefined";

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
      <button
        disabled={props.devices.pending}
        onClick={() =>
          props.fetchDevices({ name: "lg", activated: activateFilter })
        }
      >
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
    fetchDevices: filter => dispatch(fetchDevices.invoke({ filter }))
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DevicesPage);
export { DevicesPage as UnconnectedDevicesPage, connected as DevicesPage };
