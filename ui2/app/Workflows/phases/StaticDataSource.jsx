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
import { GET_INTERMEDIATES } from "./MultiPromptWizard";

const StaticDataSource = ({ phaseID }) => {
  const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
    variables: {
      id: phaseID,
    },
  });
  console.log("StaticDataSource ", data)
  const intermediates = !isEmpty(data) ? data.Get.Phase[0].intermediates : [];
  return (
    <Box>
      <Text>Data Source</Text>
      <Box h="700px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>
    </Box>
  );
};

export default StaticDataSource;
