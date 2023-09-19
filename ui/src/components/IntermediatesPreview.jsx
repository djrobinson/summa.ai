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

const IntermediatesPreview = ({ intermediates }) => {
  return (
    <Box p={6}>
      {intermediates.map((intermediate) => {
        return (
          <Box mt="10px">
            <Text>{intermediate._additional.id}</Text>
            <Text>{intermediate.text}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default IntermediatesPreview;
