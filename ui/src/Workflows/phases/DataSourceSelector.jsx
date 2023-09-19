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
import {
  createObject,
  createOneToMany,
  createRelationship,
} from "../../utils/weaviateServices";

const FETCH_DATA_SOURCES = gql`
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

const createPhaseVersion = async (workflowID, dataSource, intermediates) => {
  const phase = await createObject("Phase", {
    type: "DATA_SOURCE",
    selection: dataSource,
  });
  const intermediateIDs = intermediates.map((intermediate) => {
    return intermediate._additional.id;
  });
  await createOneToMany(
    "Phase",
    "Intermediate",
    phase.id,
    intermediateIDs,
    "intermediates",
    "phase"
  );
  await createRelationship(
    "Workflow",
    workflowID,
    "phases",
    "Phase",
    phase.id,
    "workflow"
  );
};

const DataSourceSelector = ({ id }) => {
  const [dataSource, setDataSource] = React.useState("");
  const { data, error, loading } = useQuery(FETCH_DATA_SOURCES);
  const [
    fetchDataSources,
    { data: dsData, error: dsError, loading: dsLoading },
  ] = useLazyQuery(FETCH_DATA_SOURCE, {
    variables: { id: dataSource },
  });
  React.useEffect(() => {
    fetchDataSources();
  }, [dataSource]);
  const dataSources = !isEmpty(data) ? data.Get.DataSource : [];
  const intermediates =
    !isEmpty(dsData) && !isEmpty(dsData.Get.DataSource)
      ? dsData.Get.DataSource[0].intermediates
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
      <Text
        color={"green.500"}
        textTransform={"uppercase"}
        fontWeight={800}
        fontSize={"sm"}
        letterSpacing={1.1}
      >
        Select a Data Source:
      </Text>
      <Center pt="40px">
        <Select
          w="400px"
          placeholder="Select a data type"
          onChange={(e) => {
            setDataSource(e.target.value);
          }}
          value={dataSource}
        >
          {dataSources.map((k) => (
            <option value={k._additional.id}>{k.name}</option>
          ))}
        </Select>
      </Center>
      <Box h="600px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>
      <Flex>
        <Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={() => {
            createPhaseVersion(id, dataSource, intermediates);
          }}
        >
          Use Data Source
        </Button>
      </Flex>
    </Box>
  );
};

export default DataSourceSelector;
