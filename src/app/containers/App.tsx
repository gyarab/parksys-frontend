import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { createRouteNodeSelector, RouterState } from "redux-router5";
import { createSelector } from "reselect";
import { State as IRouteState } from "router5";
import { stylesheet } from "typestyle";
import { config as appConfig } from "../../../config";
import { setupCss } from "../helpers/setupCss";
import { Translator } from "../models/Translator";
import { ITranslator } from "../models/TranslatorInterfaces";
import { IStore } from "../redux/IStore";
import { RoutePageMap } from "../routes/routes";
import { translationsSelector } from "../selectors/translationsSelector";
import { NotFoundPage } from "../pages/NotFoundPage";
import { SimpleLayout } from "../layouts/SimpleLayout";
import { Navigation } from "../components/Navigation";
import { BlankPage } from "../pages/BlankPage";
import { LoginPage } from "../pages/LoginPage";
import { DevicesPage } from "../pages/DevicesPage";
import { RulePage } from "../pages/RulePage";
import { UserPage } from "../pages/UserPage";
import { StatisticsPage } from "../pages/StatisticsPage";

setupCss();

const classNames = stylesheet({
  container: {
    margin: 0,
    padding: 0,
    height: "100%"
  }
});

interface IStateToProps {
  route: IRouteState;
  translations: {
    notFound: string;
  };
}

class App extends React.Component<IStateToProps> {
  private components: RoutePageMap = {
    homePage: {
      page: BlankPage
    },
    accountPage: {
      page: BlankPage
    },
    dashboardPage: {
      page: BlankPage
    },
    statisticsPage: {
      page: StatisticsPage,
      props: {
        title: "Statistics"
      }
    },
    rulesPage: {
      page: RulePage,
      props: {
        title: "Rules & Filters"
      }
    },
    revenuePage: {
      page: BlankPage
    },
    historyPage: {
      page: BlankPage
    },
    loginPage: {
      page: LoginPage,
      layout: null
    },
    devicesPage: {
      page: DevicesPage,
      props: {
        title: "Devices"
      }
    },
    userPage: {
      page: UserPage
    }
  };
  private defaultNavigation = Navigation;
  private defaultLayout = SimpleLayout;

  private optionalPageOption(
    segment,
    option: string,
    defaultIfUndefined: any
  ): React.ComponentClass<any, any> {
    return this.components[segment].hasOwnProperty(option)
      ? this.components[segment][option]
      : defaultIfUndefined;
  }

  private getDisplay(): JSX.Element {
    const {
      route,
      translations: { notFound }
    } = this.props;
    const segment = route ? route.name.split(".")[0] : undefined;
    if (segment && this.components[segment]) {
      // Display content
      const layout = this.optionalPageOption(
        segment,
        "layout",
        this.defaultLayout
      );
      const page = React.createElement(this.components[segment].page);
      if (layout == null) {
        return page;
      } else {
        const nav = this.optionalPageOption(
          segment,
          "nav",
          this.defaultNavigation
        );
        const navRendered = nav ? React.createElement(nav) : null;
        return React.createElement(
          layout,
          {
            ...this.optionalPageOption(segment, "props", {}),
            navigation: navRendered
          },
          page
        );
      }
    } else {
      // Not Found
      return <NotFoundPage message={notFound} />;
    }
  }

  public render(): JSX.Element {
    const display = this.getDisplay();
    return (
      <section className={classNames.container}>
        <Helmet {...appConfig.app.head} />
        {display}
      </section>
    );
  }
}

const componentTranslationsSelector = createSelector(
  translationsSelector,
  translations => {
    const translator: ITranslator = new Translator(translations);
    return {
      notFound: translator.translate("Not found")
    };
  }
);

const mapStateToProps = (
  state: Pick<IStore, "router" | "settings">
): IStateToProps & Partial<RouterState> => ({
  ...createRouteNodeSelector("")(state),
  translations: componentTranslationsSelector(state)
});

const connected = connect(mapStateToProps)(App);

export { classNames, connected as App, App as UnconnectedApp, mapStateToProps };
