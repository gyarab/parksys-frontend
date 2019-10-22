import * as React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {createRouteNodeSelector, RouterState} from "redux-router5";
import {createSelector} from "reselect";
import {State as IRouteState} from "router5";
import {stylesheet} from "typestyle";
import {config as appConfig} from "../../../config";
import {setupCss} from "../helpers/setupCss";
import {Translator} from "../models/Translator";
import {ITranslator} from "../models/TranslatorInterfaces";
import {AboutPage} from "../pages/AboutPage";
import {CounterPage} from "../pages/CounterPage";
import {HomePage} from "../pages/HomePage";
import {StarsPage} from "../pages/StarsPage";
import {IStore} from "../redux/IStore";
import {RoutePageMap} from "../routes/routes";
import {translationsSelector} from "../selectors/translationsSelector";
import { NotFoundPage } from "../pages/NotFoundPage";
import { SimpleLayout } from "../layouts/SimpleLayout";
import { Navigation } from "../components/Navigation";

setupCss();

const classNames = stylesheet({
  container: {
    margin: 0,
    padding: 0,
    height: "100%",
  },
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
      page: HomePage,
    },
    accountPage: {
      page: AboutPage,
    },
    dashboardPage: {
      page: HomePage,
    },
    statisticsPage: {
      page: CounterPage,
    },
    rulesPage: {
      page: CounterPage,
    },
      revenuePage: {
      page: StarsPage,
    },
    historyPage: {
      page: StarsPage,
    }
  };
  private defaultNavigation = Navigation;
  private defaultLayout = SimpleLayout;

  private getDisplay(): JSX.Element {
    const {route, translations: {notFound}} = this.props;
    const segment = route ? route.name.split(".")[0] : undefined;
    if (segment && this.components[segment]) {
      // Display content
      // navigation is optional (can be explicitly set to be null), layout is not optional
      const navigation = this.components[segment].hasOwnProperty("nav") ? this.components[segment].nav : this.defaultNavigation;
      const layout = this.components[segment].layout ? this.components[segment].layout : this.defaultLayout;

      return React.createElement(layout, {navigation: navigation ? React.createElement(navigation): null}, [
        React.createElement(this.components[segment].page)
      ])
    } else {
      // Not Found
      return <NotFoundPage message={notFound} />
    }
  }

  public render(): JSX.Element {
    const display = this.getDisplay();
    return (
      <section className={classNames.container}>
        <Helmet {...appConfig.app.head}/>
        {display}
      </section>
    );
  }
}

const componentTranslationsSelector = createSelector(
  translationsSelector,
  (translations) => {
    const translator: ITranslator = new Translator(translations);
    return {
      notFound: translator.translate("Not found")
    };
  }
);

const mapStateToProps = (state: Pick<IStore, "router" | "settings">): IStateToProps & Partial<RouterState> => ({
  ...createRouteNodeSelector("")(state),
  translations: componentTranslationsSelector(state)
});

const connected = connect(mapStateToProps)(App);

export {classNames, connected as App, App as UnconnectedApp, mapStateToProps};
