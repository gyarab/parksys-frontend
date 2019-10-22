import {ComponentClass} from "react";
import {Action} from "redux";
import {actions} from "redux-router5";
import { ILayoutProps } from "../layouts/Layout";

interface IRoute {
  name: RoutablePages;
  path: string;
}
type RoutablePages = "homePage"
| "accountPage"
| "dashboardPage"
| "statisticsPage"
| "rulesPage"
| "revenuePage"
| "historyPage";
interface PageRecord {
  page: ComponentClass;
  nav?: ComponentClass;
  layout?: ComponentClass<ILayoutProps>;
}

type RouteConfig = Record<RoutablePages, Omit<IRoute, "name">>;
export type RoutePageMap = Record<RoutablePages, PageRecord>;
type RouteNavigate = Record<RoutablePages, (...params: any[]) => Action>;

function getRoutes(routeConfig: RouteConfig): Record<RoutablePages, IRoute> {
  return Object.keys(routeConfig)
    .map((key) => ({
      name: key,
      path: routeConfig[key].path
    }))
    .reduce(
      (a, c) => {
        a[c.name] = c;
        return a;
      },
      {} as any
    );
}

function getNavigateAction<T extends {[key: string]: any}>(routeName: RoutablePages, params?: T): Action {
  return actions.navigateTo(routeName, params);
}

const config: RouteConfig = {
  homePage: {path: "/"},
  accountPage: {path: "/account"},
  dashboardPage: {path: "/dashboard"},
  statisticsPage: {path: "/statistics"},
  rulesPage: {path: "/rules"},
  revenuePage: {path: "/revenue"},
  historyPage: {path: "/history"},
};

export const routes = getRoutes(config);

export const navigate: RouteNavigate = {
  homePage: () => getNavigateAction(routes.homePage.name),
  accountPage: () => getNavigateAction(routes.accountPage.name),
  dashboardPage: () => getNavigateAction(routes.dashboardPage.name),
  statisticsPage: () => getNavigateAction(routes.statisticsPage.name),
  rulesPage: () => getNavigateAction(routes.rulesPage.name),
  revenuePage: () => getNavigateAction(routes.revenuePage.name),
  historyPage: () => getNavigateAction(routes.historyPage.name),
};
