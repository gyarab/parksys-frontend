import React from "react";

interface ILayoutProps {
  navigation?: JSX.Element;
  title?: JSX.Element | string;
  children: JSX.Element;
}

class LayoutComponent<
  T extends ILayoutProps = ILayoutProps
> extends React.Component<T> {}

export { LayoutComponent, ILayoutProps };
