import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import {
  Cache,
  cacheExchange,
  DataField,
  QueryInput,
} from "@urql/exchange-graphcache";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
} from "../generated/graphql";
import theme from "../theme";

function updateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (mutation: Result, data: Query) => Query
) {
  cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            updateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (mutation, data) => {
                if (mutation.login.response) {
                  return {
                    me: mutation.login.response,
                  };
                }
                return data;
              }
            );
          },
          logout: (_result, args, cache, info) => {
            updateQuery<LogoutMutation, DataField>(
              cache,
              { query: MeDocument },
              _result,
              () => ({
                me: null,
              })
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
  fetchOptions: { credentials: "include" },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
