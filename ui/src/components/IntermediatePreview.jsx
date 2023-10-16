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
import { useQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";


export const GET_INTERMEDIATE = gql`
  query GetIntermediate($id: String!) {
    Get {
      Intermediate(where: { path: "id", operator: Equal, valueString: $id }) {
        _additional {
            id
        }
        text
      }
    }
  }
`;



const IntermediatePreview = ({ id, highlightText }) => {
    const { data, error, loading } = useQuery(GET_INTERMEDIATE, {
        variables: { id },
    });
    console.log("Intermediate Preview: ", data, error, loading);
    const intermediate = !isEmpty(data) && !isEmpty(data.Get.Intermediate) ? data.Get.Intermediate[0] : { text: ''};
    const passage = intermediate.text.replaceAll('\n', ' ')
  const splitText = intermediate ? passage.split(highlightText) : ["", ""]
  const afterText = splitText[1]
  const beforeText = splitText[0].slice(splitText[0].length - 100, splitText[0].length)
  return (
    <Box p={6}>
        <Box mt="10px">
        <Text>
          <Text as="span">
            {beforeText + " "}
          </Text>
          {highlightText && <><Text as="span" bg="yellow">
            {highlightText  + " "}
          </Text>
          <Text as="span">
            {afterText}
          </Text></>}</Text>
        </Box>
    </Box>
  );
};

export default IntermediatePreview;
