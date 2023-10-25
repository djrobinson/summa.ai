import React from "react";

import { gql, useLazyQuery, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import ConfigureDataSource from "../../DataSources/ConfigureDataSource";
import IntermediatesPreview from "../../components/IntermediatesPreview";
import {
  createObject,
  createOneToMany,
  createRelationship,
} from "../../utils/weaviateServices";

export const FETCH_DATA_SOURCES = gql`
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

export const FETCH_DATA_SOURCE = gql`
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

export const createDataSourcePhase = async (
  workflowID,
  dataSource,
  dataSourceCount,
  intermediates = []
) => {
  const phase = await createObject("Phase", {
    type: "DATA_SOURCE",
    selection: dataSource,
    workflow_step: 1,
    step_order: dataSourceCount + 1,
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
  return phase;
};

const DataSourceSelector = ({ id, dataSourceCount, addPhase }) => {
  const [dataSource, setDataSource] = React.useState("");
  const [createNew, setCreateNew] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const { data, error, loading } = useQuery(FETCH_DATA_SOURCES);
  const [
    fetchDataSources,
    { data: dsData, error: dsError, loading: dsLoading },
  ] = useLazyQuery(FETCH_DATA_SOURCE, {
    variables: { id: dataSource },
  });
  React.useEffect(() => {
    fetchDataSources();
  }, [dataSource, fetchDataSources]);
  const dataSources = !isEmpty(data) ? data.Get.DataSource : [];
  const intermediates =
    !isEmpty(dsData) &&
    !isEmpty(dsData.Get.DataSource) &&
    !isEmpty(dsData.Get.DataSource[0].intermediates)
      ? dsData.Get.DataSource[0].intermediates
      : [];
  console.log("DS DATA: ", intermediates);
  return (
    <>
      <Text
        color={"teal.600"}
        textTransform={"uppercase"}
        fontWeight={800}
        fontSize={"sm"}
        letterSpacing={1.1}
        p="20px"
        textAlign={"center"}
      >
        Select a Data Source
      </Text>
      {createNew ? (
        <>
          <Button
            onClick={() => {
              setNewTitle(null);
              setCreateNew(false);
            }}
            mt="10px"
            size="xs"
            colorScheme="teal"
            variant="outline"
          >
            Cancel Create New
          </Button>
          <Text
            color={"teal.600"}
            textTransform={"uppercase"}
            fontWeight={800}
            fontSize={"sm"}
            letterSpacing={1.1}
            p="20px"
            textAlign={"center"}
          >
            {newTitle}
          </Text>
          <ConfigureDataSource />
        </>
      ) : (
        <Flex>
          <Box
            h="240px"
            rounded="10px"
            align="center"
            justify="center"
            w="50%"
            p="20px"
            pt="60px"
          >
            <FormLabel fontWeight="800" color="teal" size="sm">
              Use Existing:
            </FormLabel>
            <Center>
              <Select
                placeholder="Select a data type"
                onChange={(e) => {
                  setDataSource(e.target.value);
                }}
              >
                {dataSources.map((k) => (
                  <option
                    selected={dataSource === k._additional.id}
                    value={k._additional.id}
                  >
                    {k.name}
                  </option>
                ))}
              </Select>
            </Center>
            {!isEmpty(dataSource) && (
              <Button
                onClick={() => setDataSource(null)}
                mt="10px"
                size="xs"
                colorScheme="teal"
                variant="outline"
              >
                Clear
              </Button>
            )}
          </Box>
          {!isEmpty(intermediates) ? (
            <Box align="center" w="50%">
              <Box maxH="600px" overflowY={"scroll"}>
                <IntermediatesPreview intermediates={intermediates} />
              </Box>
              <Button
                mt={"20px"}
                colorScheme="teal"
                rounded={"full"}
                flex={"1 0 auto"}
                isDisabled={isCreating}
                onClick={async () => {
                  setIsCreating(true);
                  const newPhase = await createDataSourcePhase(
                    id,
                    dataSource,
                    dataSourceCount,
                    intermediates
                  );
                  console.log("Refreshing parent", newPhase);

                  addPhase({
                    _additional: {
                      id: newPhase.id,
                    },
                    ...newPhase.properties,
                  });
                }}
              >
                Use Data Source
              </Button>
            </Box>
          ) : (
            <Box
              borderLeft="solid 1px lightgray"
              w="50%"
              h="240px"
              p="20px"
              pt="60px"
              rounded="10px"
              align="center"
              justify="center"
            >
              <FormLabel fontWeight="800" color="teal" size="sm">
                Create New:
              </FormLabel>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Button
                mt={"20px"}
                mb="20px"
                colorScheme="teal"
                rounded={"full"}
                flex={"1 0 auto"}
                isDisabled={isCreating}
                onClick={async () => {
                  console.log("Refreshing parent");
                  setCreateNew(true);
                }}
              >
                Create New
              </Button>
            </Box>
          )}
        </Flex>
      )}
    </>
  );
};

export default DataSourceSelector;
