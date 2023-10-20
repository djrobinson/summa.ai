import React from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Wrap,
  Flex,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { useLazyQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";

const IntermediatesPreview = ({ intermediates = [] }) => {
  if (!intermediates) return null
  return (
    <Box p={6}>
      {intermediates.map((intermediate, i) => {
        return (
          <Box p="4px" pb="20px" mt="20px" borderBottom="solid 2px lightgray" textAlign="justify">
            <Text fontWeight="800" size="xs" mb="20px">Record #{i+1}</Text>
            <Text>{intermediate.text}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default IntermediatesPreview;
