import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Layout from "./Layout";
import WorkflowBuilder from "./Workflows/WorkflowBuilder";
import DataSources from "./DataSources/DataSources";
import RequestManager from "./RequestManager/RequestManager";
import Home from "./Home";
import Workflow from "./Workflows/Workflow";
import AccountManager from "./AccountManager/AccountManager";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { isEmpty } from "lodash";
import { useRecoilState } from "recoil";
import { apiKeyState } from "./recoil/atoms";


export default function App() {
  const [apiKey, setApiKey] = useRecoilState(apiKeyState)
  const client = new ApolloClient({
    uri: "http://localhost:8080/v1/graphql",
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
  React.useEffect(() => {
    console.log("useEffect");
    setApiKey(localStorage.getItem("OPENAI_API_KEY") || "");
  }, [setApiKey]);
  return (
    <ApolloProvider client={client}>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout hideOptions={isEmpty(apiKey)} />}>
          <Route index element={<Home />} />
          <Route path="/workflows" element={<WorkflowBuilder />} />
          <Route path="/workflows/:id" element={<Workflow />} />
          <Route path="/data" element={<DataSources />} />
          <Route path="/reports" element={<DataSources />} />
          <Route path="/requests" element={<RequestManager />} />
          <Route path="/account" element={<AccountManager presetApiKey={apiKey} />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>

    </ApolloProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the Speeches page</Link>
      </p>
    </div>
  );
}
