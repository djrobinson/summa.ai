import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Layout from "./Layout";
import WorkflowBuilder from "./Workflows/WorkflowBuilder";
import DataSources from "./DataSources/DataSources";
import RequestManager from "./RequestManager/RequestManager";
import Home from "./Home";
import Workflow from "./Workflows/Workflow";

export default function App() {
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/workflows" element={<WorkflowBuilder />} />
          <Route path="/workflows/:id" element={<Workflow />} />
          <Route path="/data" element={<DataSources />} />
          <Route path="/reports" element={<DataSources />} />
          <Route path="/requests" element={<RequestManager />} />
          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
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
