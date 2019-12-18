import React, { useState, useEffect } from "react";
import imageGetter from "../helpers/imageGetter";
import { Button } from "./Button";

const DeviceRowSubcomponent = ({
  regenerateActivationPasswordEffect,
  updateDevice,
  device
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
        })
        .catch(err => {
          console.log(err);
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

  if (device.activated) {
    return <div>Device is activated</div>;
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
