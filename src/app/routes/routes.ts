import { ComponentClass } from "react";
import { Action } from "redux";
import { actions } from "redux-router5";
import { ILayoutProps } from "../layouts/Layout";

interface IRoute {
  name: RoutablePages;
  path: string;
}
type RoutablePages =
  | "accountPage"
  | "dashboardPage"
  | "statisticsPage"
  | "rulesPage"
  | "loginPage"
  | "devicesPage"
  | "userPage"
  | "userMngmtPage"
  | "vehiclePage";
interface PageRecord {
  page: ComponentClass | (() => JSX.Element);
  nav?: ComponentClass | (() => JSX.Element);
  layout?: ComponentClass<ILayoutProps>;
  props?: Partial<ILayoutProps>;
}

type RouteConfig = Record<RoutablePages, Omit<IRoute, "name">>;
export type RoutePageMap = Record<RoutablePages, PageRecord>;
type RouteNavigate = Record<RoutablePages, (...params: any[]) => Action>;

function getRoutes(routeConfig: RouteConfig): Record<RoutablePages, IRoute> {
  return Object.keys(routeConfig)
    .map(key => ({
      name: key,
      path: routeConfig[key].path
    }))
    .reduce((a, c) => {
      a[c.name] = c;
      return a;
    }, {} as any);
}

function getNavigateAction<T extends { [key: string]: any }>(
  routeName: RoutablePages,
  params?: T
): Action {
  return actions.navigateTo(routeName, params);
}

const config: RouteConfig = {
  accountPage: { path: "/account" },
  dashboardPage: { path: "/dashboard" },
  statisticsPage: { path: "/statistics" },
  rulesPage: { path: "/rules" },
  loginPage: { path: "/" },
  devicesPage: { path: "/devices" },
  userPage: { path: "/user" },
  userMngmtPage: { path: "/users" },
  vehiclePage: { path: "/vehicles" }
};

export const routes = getRoutes(config);

export const navigate: RouteNavigate = {
  accountPage: () => getNavigateAction(routes.accountPage.name),
  dashboardPage: () => getNavigateAction(routes.dashboardPage.name),
  statisticsPage: () => getNavigateAction(routes.statisticsPage.name),
  rulesPage: () => getNavigateAction(routes.rulesPage.name),
  loginPage: () => getNavigateAction(routes.loginPage.name),
  devicesPage: () => getNavigateAction(routes.devicesPage.name),
  userPage: () => getNavigateAction(routes.userPage.name),
  userMngmtPage: () => getNavigateAction(routes.userMngmtPage.name),
  vehiclePage: () => getNavigateAction(routes.vehiclePage.name)
};
