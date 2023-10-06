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
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useLazyQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";
import Checkmark from "../components/Checkmark";
import IntermediatesPreview from "../components/IntermediatesPreview";
import { FiRefreshCcw } from "react-icons/fi";

const FETCH_DATA_SOURCE = gql`
  query GetDataSource($id: String!) {
    Get {
      DataSource(where: { operator: Equal, path: ["id"], valueString: $id }) {
        _additional {
          id
        }
        name
        intermediates {
          ... on Intermediate {
            _additional {
              id
            }
            text
          }
        }
      }
    }
  }
`;

const ConfirmDataSource = ({ setShowConfigure, setDsID, dataSourceID }) => {
  const [fetchDataSources, { data, error, loading }] = useLazyQuery(
    FETCH_DATA_SOURCE,
    {
      variables: { id: dataSourceID },
    }
  );
  console.log("Confirm Data Sources: ", data, error, loading);
  React.useEffect(() => {
    fetchDataSources();
  }, []);
  const intermediates =
    !isEmpty(data) &&
    !isEmpty(data.Get.DataSource) &&
    !isEmpty(data.Get.DataSource[0].intermediates)
      ? data.Get.DataSource[0].intermediates
      : [];
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
      <Stack p="20px">
        <Text
          color={"green.500"}
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          Preview your split
        </Text>
        <Flex p="40px" justify={"center"}>
          <Checkmark />
        </Flex>
        <Flex>
          <Heading>Preview</Heading>
          <Icon
            onClick={() => fetchDataSources()}
            m="10px"
            as={FiRefreshCcw}
            w={6}
            h={6}
          />
        </Flex>
        <Box h={"400px"} overflowY={"scroll"}>
          <IntermediatesPreview intermediates={intermediates} />
        </Box>
        <Button
          onClick={() => {
            setShowConfigure(true);
          }}
          colorScheme="teal"
          variant="outline"
          rounded={"full"}
        >
          Start a Workflow with this Data
        </Button>
      </Stack>
    </Box>
  );
};

export default ConfirmDataSource;
