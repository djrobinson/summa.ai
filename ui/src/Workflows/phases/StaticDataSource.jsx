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
  Center,
  Select,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";

import IntermediatesPreview from "../../components/IntermediatesPreview";

const StaticDataSource = ({ dsID, intermediates }) => {
  return (
    <Box>
      <Text>{dsID}</Text>
      <Box h="700px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>
    </Box>
  );
};

export default StaticDataSource;
