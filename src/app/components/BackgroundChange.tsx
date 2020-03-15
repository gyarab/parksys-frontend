import React, { useState, useEffect } from "react";
import { stylesheet } from "typestyle";

const styles = stylesheet({
  changer: {
    transition: "all 0.5s ease-out"
  }
});

interface IProps {
  children: any;
  watched: any;
  standardColor?: any;
  accentColor?: any;
}

export const BackgroundChange = (props: IProps) => {
  const standardColor = !props.standardColor ? "white" : props.standardColor;
  const accentColor = !props.accentColor ? "#ccc" : props.accentColor;
  const [firstRender, setFirstRender] = useState(true);
  const [background, setBackground] = useState(false);
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    } else {
      // Changed values
      setBackground(true);

      const timer = setTimeout(() => {
        setBackground(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [props.watched]);
  return (
    <div
      className={styles.changer}
      style={{ backgroundColor: background ? accentColor : standardColor }}
    >
      {props.children}
    </div>
  );
};
