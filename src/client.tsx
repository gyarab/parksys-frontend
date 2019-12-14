import * as e6p from "es6-promise";
(e6p as any).polyfill();
import "isomorphic-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { setStylesTarget } from "typestyle";
import { config as appConfig } from "../config";
import { App } from "./app/containers/App";
import { configureStore } from "./app/redux/configureStore";
import { setLanguage } from "./app/redux/modules/settingsActionCreators";
import { configureRouter } from "./app/routes/configureRouter";
import rootSaga from "./app/sagas/rootSaga";
import { createApolloClient } from "./app/apis/gql";
import { ApolloProvider } from "@apollo/react-hooks";

const ReactHotLoader =
  appConfig.env !== "production"
    ? require("react-hot-loader").AppContainer
    : ({ children }) => React.Children.only(children);

const renderOrHydrate = appConfig.ssr ? ReactDOM.hydrate : ReactDOM.render;

const router = configureRouter();
const store = configureStore(router, window.__INITIAL_STATE__);
const apolloClient = createApolloClient(store);
const rootSagaGenerator = rootSaga(apolloClient);
let sagaTask = store.runSaga(rootSagaGenerator);
if (!appConfig.ssr) {
  store.dispatch(setLanguage.invoke("en"));
}
router.start();

renderOrHydrate(
  <ReactHotLoader>
    <ApolloProvider client={apolloClient}>
      <Provider store={store} key="provider">
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </Provider>
    </ApolloProvider>
  </ReactHotLoader>,
  document.getElementById("app")
);

setStylesTarget(document.getElementById("styles-target"));

if ((module as any).hot) {
  (module as any).hot.accept("./app/containers/App", () => {
    const { App: NewApp } = require("./app/containers/App");
    renderOrHydrate(
      <ReactHotLoader>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <RouterProvider router={router}>
              <NewApp />
            </RouterProvider>
          </Provider>
        </ApolloProvider>
      </ReactHotLoader>,
      document.getElementById("app")
    );
  });

  (module as any).hot.accept("./app/sagas/rootSaga", () => {
    sagaTask.cancel();
    sagaTask.toPromise().then(() => {
      sagaTask = store.runSaga(
        require("./app/sagas/rootSaga").default(apolloClient)
      );
    });
  });
}
