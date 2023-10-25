import React from "react";

import { Box, Text } from "@chakra-ui/react";

const IntermediatesPreview = ({ intermediates = [] }) => {
  if (!intermediates) return null;
  return (
    <Box p={2}>
      <Text fontSize="sm" fontWeight="800" color="teal.600">
        Preview Results:
      </Text>
      {intermediates.map((intermediate, i) => {
        return (
          <Box
            p="4px"
            pb="20px"
            mt="20px"
            borderBottom="solid 2px lightgray"
            textAlign="justify"
          >
            <Text fontWeight="800" fontSize="xs" mb="20px" color="teal.600">
              Record #{i + 1}
            </Text>
            <Text>{intermediate.text}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default IntermediatesPreview;
