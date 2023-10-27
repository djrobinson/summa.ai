import React from "react";

import { Box, Text } from "@chakra-ui/react";

const CombineNode = ({ type }) => {
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight={800}>Combine</Text>
    </Box>
  );
};

export default CombineNode;
