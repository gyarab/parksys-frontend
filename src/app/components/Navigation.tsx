import React from "react";
import { stylesheet } from "typestyle";
import { Color } from "../constants";
import { ITranslator } from "../models/TranslatorInterfaces";
import { Translator } from "../models/Translator";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { IStore } from "../redux/IStore";
import { translationsSelector } from "../selectors/translationsSelector";
import { ConnectedLink } from "react-router5";
import { routes } from "../routes/routes";

const classNames = stylesheet({
  nav: {
    padding: "1em",
    width: "100%",
    height: "100%",
    color: Color.WHITE,
    backgroundColor: Color.MAIN_BG,
    $nest: {
      ul: {
        display: "table",
        width: "100%",
        listStyleType: "none",
      },
    },
  },
  activeLink: {
    textDecoration: "underline",
    backgroundColor: Color.GREY,
  },
  navItem: {
    width: "100%",
    marginBottom: "10px",
    $nest: {
      a: {
        padding: "0.4em 0 0.3em 0.2em",
        fontWeight: "bold",
        width: "100%",
        display: "block",
        $nest: {
          "&:hover": {
            textDecoration: "underline",
          }
        }
      },
    }
  }
});

interface IStateToProps {
  translations: {
    pages: {
      home: string;
      account: string;
      dashboard: string;
      statistics: string;
      rules: string;
      revenue: string;
      history: string;
    },
  };
}

const NavLink = ({ linkText, route }) => {
  // TODO: Use props.children for sublinks
  return (
    <li className={classNames.navItem}>
      <ConnectedLink activeClassName={classNames.activeLink} routeName={route.name}>
        {linkText}
      </ConnectedLink>
    </li>
  )
}

class Navigation extends React.Component<IStateToProps> {
  render(): JSX.Element {
    const {translations: {pages}} = this.props
    return (
      <nav className={classNames.nav}>
        <ul>
          <NavLink linkText={pages.home} route={routes.homePage} />
          <NavLink linkText={pages.dashboard} route={routes.dashboardPage} />
          <NavLink linkText={pages.statistics} route={routes.statisticsPage} />
          <NavLink linkText={pages.rules} route={routes.rulesPage} />
          <NavLink linkText={pages.revenue} route={routes.revenuePage} />
          <NavLink linkText={pages.history} route={routes.historyPage} />
        </ul>
      </nav>
    );
  }
}

const componentTranslationsSelector = createSelector(
  translationsSelector,
  (translations) => {
    const translator: ITranslator = new Translator(translations);
    return {
      pages: {
        home: translator.translate("Home"),
        dashboard: translator.translate("Dashboard"),
        account: translator.translate("Account"),
        statistics: translator.translate("Statistics"),
        rules: translator.translate("Rules"),
        revenue: translator.translate("Revenue"),
        history: translator.translate("History")
      }
    };
  }
);

function mapStateToProps(state: Pick<IStore, "settings">): IStateToProps {
  return {
    translations: componentTranslationsSelector(state)
  };
}

const connected = connect(mapStateToProps)(Navigation);
export {connected as Navigation, Navigation as UnconnectedNavigation};
