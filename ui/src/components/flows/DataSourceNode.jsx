import React from "react";

import { useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { FETCH_DATA_SOURCE } from "../../Workflows/phases/DataSourceSelector";

const DataSourceNode = ({ type, selection }) => {
  const { data, error, loading } = useQuery(FETCH_DATA_SOURCE, {
    variables: { id: selection },
  });
  const dataSourceData = data ? data.Get.DataSource[0] : {};
  console.log("What is dataSourceData ", dataSourceData);
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight="800">Data Source</Text>
      <Text>{dataSourceData.name}</Text>
      <Text>
        {dataSourceData.intermediates
          ? dataSourceData.intermediates.length
          : "Loading"}{" "}
        Output Records
      </Text>
    </Box>
  );
};

export default DataSourceNode;
