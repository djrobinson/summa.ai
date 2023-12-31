import React from "react";

import { Box, Text } from "@chakra-ui/react";

const FilterNode = ({ type }) => {
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight={800}>Filter/Sort</Text>
      <Text>Filters: {prompt}</Text>
    </Box>
  );
};

export default FilterNode;
