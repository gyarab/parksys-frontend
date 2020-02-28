import React, { useState, useEffect } from "react";
import imageGetter from "../helpers/imageGetter";
import { Button } from "./Button";
import { stylesheet } from "typestyle";
import { TwoPicker } from "./pickers/TwoPicker";
import SaveStatus from "../constants/SaveStatus";
import { NumberInput } from "./pickers/NumberInput";

const styles = stylesheet({
  pickers: {
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    gridGap: "0.3em 0.4em",
    alignItems: "center"
  }
});

const DeviceConfigEditor = ({ device, onSave, saveStatus }) => {
  const [config, setConfig] = useState({
    ...device.config,
    __typename: undefined
  });
  return (
    <div>
      <div className={styles.pickers}>
        <span>Type</span>
        <TwoPicker
          optionLeft="OUT"
          optionRight="IN"
          rightIsSelected={config.type === "IN"}
          onChange={type => setConfig({ ...config, type })}
        />
        <span>Capturing</span>
        <TwoPicker
          optionLeft="NO"
          optionRight="YES"
          rightIsSelected={!!config.capturing}
          onChange={capturingOption =>
            setConfig({ ...config, capturing: capturingOption === "YES" })
          }
        />
        <span>Minimal Area</span>
        <NumberInput
          value={config.minArea}
          onChange={value =>
            setConfig({
              ...config,
              minArea: Math.max(value, 0)
            })
          }
        />
        <span>Resize X</span>
        <NumberInput
          value={config.resizeX}
          onChange={value =>
            setConfig({
              ...config,
              resizeX: Math.max(value, 0)
            })
          }
        />
        <span>Resize Y</span>
        <NumberInput
          value={config.resizeY}
          onChange={value =>
            setConfig({
              ...config,
              resizeY: Math.max(value, 0)
            })
          }
        />
      </div>
      <div style={{ marginBottom: "1em" }}></div>
      <Button
        type="primary"
        onClick={() => onSave(config)}
        disabled={
          saveStatus !== SaveStatus.NONE && saveStatus !== SaveStatus.FAILED
        }
      >
        {saveStatus}
      </Button>
    </div>
  );
};

const DeviceRowSubcomponent = ({
  regenerateActivationPasswordEffect,
  updateConfigEffect,
  updateDevice,
  device,
  toggleExpand,
  setError
}) => {
  const [expiresAt, setExpiration] = useState(
    new Date(device.activationPasswordExpiresAt)
  );

  const [imageData, setImageData] = useState(null);
  const [expiresIn, setExpiresIn] = useState(
    expiresAt.getTime() - new Date().getTime()
  );

  const [expirationInterval, setExpirationInterval] = useState(null);
  const expired = expiresIn <= 0;
  const shouldFetchImg = !device.activated && !expired;

  const stopExpirationInterval = () => {
    if (expirationInterval !== null) clearInterval(expirationInterval);
    setExpirationInterval(null);
  };
  const recalcExpiresIn = () => {
    setExpiresIn(expiresAt.getTime() - new Date().getTime());
  };

  if (expiresIn > 0 && expirationInterval === null) {
    const interval = setInterval(() => {
      recalcExpiresIn();
    }, 1000);
    setExpirationInterval(interval);
  } else if (expiresIn <= 0 && expirationInterval !== null) {
    stopExpirationInterval();
  }

  // Anytime expiresAt changes, recalculate expiresIn
  useEffect(() => recalcExpiresIn(), [expiresAt]);
  useEffect(() => {
    if (shouldFetchImg) {
      imageGetter(device.activationQrUrl)
        .then(response => response.blob())
        .then(blob => {
          setImageData(URL.createObjectURL(blob));
          setError(null);
        })
        .catch(err => {
          setError(err);
        });
    }
    return () => {
      // Cleanup
      setImageData(null);
      if (expirationInterval !== null) {
        clearInterval(expirationInterval);
      }
    };
  }, [shouldFetchImg]);

  const onRegenerateClick = () => {
    regenerateActivationPasswordEffect({ variables: { id: device.id } }).then(
      result => {
        const payload = result.data.deviceRegenerateActivationPassword;
        stopExpirationInterval();
        setExpiration(new Date(payload.activationPasswordExpiresAt));
        updateDevice(device.id, payload);
      }
    );
  };

  const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.NONE);
  const updateConfig = config => {
    setSaveStatus(SaveStatus.SAVING);
    updateConfigEffect({ variables: { id: device.id, config } })
      .then(result => {
        setError(null);
        setSaveStatus(SaveStatus.SUCCEEDED);
        updateDevice(device.id, {
          ...device,
          config: result.data.updateDeviceConfig.config
        });
      })
      .catch(err => {
        setError(err);
        setSaveStatus(SaveStatus.FAILED);
      });
    toggleExpand(device.id, false);
  };

  if (device.activated) {
    // Config
    return (
      <DeviceConfigEditor
        device={device}
        onSave={updateConfig}
        saveStatus={saveStatus}
      />
    );
  } else if (!shouldFetchImg || expired) {
    return (
      <div>
        <span>Activation Qr code has expired.</span>
        <Button onClick={onRegenerateClick}>
          Regenerate Activation Password
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <span style={{ display: "block" }}>
          Activation expires in <u>{Math.round(expiresIn / 1000)} seconds</u>
        </span>
        {imageData == null ? (
          <div>Loading QR Code...</div>
        ) : (
          <img src={imageData}></img>
        )}
      </div>
    );
  }
};

export default DeviceRowSubcomponent;
