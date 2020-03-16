import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import lodash from "lodash";
import { IExtendedStore } from "../redux/configureStore";
import { onError } from "apollo-link-error";
import { config } from "../../../config";
import {
  ERRORS_SET_GRAPHQL_ERROR,
  ERRORS_SET_NETWORK_ERROR
} from "../redux/modules/errorsActionCreators";
const introspectionQueryResultData = require("../../fragmentTypes.json");

export const createApolloClient = (store: IExtendedStore) => {
  // TODO: ON NOT ERROR CLEAR
  // https://www.npmjs.com/package/apollo-link-error
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      store.dispatch({
        type: ERRORS_SET_GRAPHQL_ERROR,
        payload: graphQLErrors
      });
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    } else {
      store.dispatch({ type: ERRORS_SET_GRAPHQL_ERROR, payload: null });
    }
    if (networkError) {
      let nError: any = networkError;
      if (
        String(networkError) ===
        "TypeError: NetworkError when attempting to fetch resource."
      ) {
        nError = "Backend is unreachable.";
      }
      console.log(`[Network error]: ${nError}`);
      store.dispatch({ type: ERRORS_SET_NETWORK_ERROR, payload: nError });
    } else {
      store.dispatch({ type: ERRORS_SET_NETWORK_ERROR, payload: null });
    }
  });

  // https://medium.com/risan/set-authorization-header-with-apollo-client-e934e6517ccf
  const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authorization token from state.
    const token = lodash.get(store.getState(), "user.accessToken");

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });

  // https://www.robinwieruch.de/react-redux-apollo-client-state-management-tutorial
  const baseLink = new HttpLink({
    uri: `${config.backendApi.root}${config.backendApi.graphql}`
  });

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(baseLink)),
    cache: new InMemoryCache({ fragmentMatcher }),
    connectToDevTools: true
  });
  return client;
};
