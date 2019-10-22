import React from "react";

interface ILayoutProps {
  navigation?: JSX.Element;
  children: JSX.Element;
}

class LayoutComponent<T extends ILayoutProps = ILayoutProps> extends React.Component<T> {}

export { LayoutComponent, ILayoutProps };
