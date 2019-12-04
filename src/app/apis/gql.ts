import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import lodash from "lodash";
import { IExtendedStore } from "../redux/configureStore";
import { onError } from "apollo-link-error";

// Taken from: https://www.robinwieruch.de/react-redux-apollo-client-state-management-tutorial
export const baseLink = new HttpLink({
  uri: "http://127.0.0.1:8080/graphql"
});

export const createApolloClient = (store: IExtendedStore) => {
  // https://www.npmjs.com/package/apollo-link-error
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  // Taken from: https://medium.com/risan/set-authorization-header-with-apollo-client-e934e6517ccf
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

  const client = new ApolloClient({
    link: errorLink.concat(authLink.concat(baseLink)),
    cache: new InMemoryCache()
  });
  return client;
};
