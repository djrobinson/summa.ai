import React from "react";

import { Box, Text } from "@chakra-ui/react";

const CategorizeNode = ({ type }) => {
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight={800}>Categorize</Text>
    </Box>
  );
};

export default CategorizeNode;
