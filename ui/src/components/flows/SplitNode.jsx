import React from "react";

import { Box, Text } from "@chakra-ui/react";

const SplitNode = ({ type }) => {
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight={800}>Split</Text>
    </Box>
  );
};

export default SplitNode;
