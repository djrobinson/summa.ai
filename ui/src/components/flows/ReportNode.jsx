import React from "react";

import { Box, Text } from "@chakra-ui/react";

const ReportNode = ({ type }) => {
  return (
    <Box m="10px" rounded={"md"} p={6}>
      <Text>{type}</Text>
    </Box>
  );
};

export default ReportNode;
