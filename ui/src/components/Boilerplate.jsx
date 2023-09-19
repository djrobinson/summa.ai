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
import Checkmark from "../components/Checkmark";

const FETCH_DATA_SOURCE = gql`
  {
    Get {
      DataSource {
        _additional {
          id
        }
        name
      }
    }
  }
`;

const ConfirmDataSource = ({ setShowConfigure, setDsID, dsID }) => {
  let progress = useMotionValue(90);
  return (
    <Box
      m="10px"
      w={"500px"}
      height={"800px"}
      // eslint-disable-next-line react-hooks/rules-of-hooks
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
    >
      <Heading>hey</Heading>
      <Checkmark progress={progress} />
    </Box>
  );
};

export default ConfirmDataSource;
