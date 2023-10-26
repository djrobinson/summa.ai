import React from "react";

import { Box, Text } from "@chakra-ui/react";

const LLMPrompNode = ({ type, prompt }) => {
  return (
    <Box
      rounded={"md"}
      textAlign="left"
      align="flex-start"
      justify="flex-start"
    >
      <Text fontWeight={800}>LLM Prompt</Text>
      <Text>Prompt: {prompt}</Text>
    </Box>
  );
};

export default LLMPrompNode;
