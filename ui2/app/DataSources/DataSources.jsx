import React from "react";

import ConfigureDataSource from "./ConfigureDataSource";
import DataSourcesHome from "./DataSourceHome";

const DataSources = () => {
  const [showConfigure, setShowConfigure] = React.useState(false);
  const [dsID, setDsID] = React.useState("");

    return (
      <DataSourcesHome
        dsID={dsID}
        setShowConfigure={setShowConfigure}
        setDsID={setDsID}
      />
    );

};

export default DataSources;
