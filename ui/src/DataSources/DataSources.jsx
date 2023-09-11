import React from "react";

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

const FETCH_WORKFLOWS = gql`
  {
    Get {
      Workflow {
        _additional {
          id
        }
        name
        phases {
          ... on Phase {
            _additional {
              id
            }
            title
            mode
            type
          }
        }
      }
    }
  }
`;

const WorkflowTile = ({
  phaseId,
  phase,
  addPhase,
  updatePhase,
  setPhases,
  prevId,
  schema,
  description,
}) => {
  return <Heading>Workflow Tile</Heading>;
};

const DataSources = () => {
  const [sources, setsources] = React.useState([]);
  const [fetchWorkflows, { data, error, loading }] =
    useLazyQuery(FETCH_WORKFLOWS);
  console.log("workflows: ", data, error, loading);
  const [newWorkflowTitle, setNewWorkflowTitle] = React.useState("");
  const workflows = !isEmpty(data) ? data.Get.Workflow : [];
  React.useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  if (isEmpty(sources)) {
    return (
      <Wrap>
        <Box
          m="10px"
          maxW={"400px"}
          w={"95%"}
          height={"400px"}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
        >
          <Heading>+ New Data Source</Heading>
          <Text mt="40px" p="5px">
            Add your data!
          </Text>
          <FormLabel size="xs">Data Source Name:</FormLabel>
          <Input
            value={newWorkflowTitle}
            onChange={(e) => setNewWorkflowTitle(e.target.value)}
          />
          <Flex justify="flex-end">
            <Button
              onClick={() => {}}
              colorScheme="teal"
              alignSelf="end"
              mt="40px"
            >
              Create
            </Button>
          </Flex>
        </Box>

        {workflows.map((w) => (
          <Box
            m="10px"
            maxW={"400px"}
            w={"95%"}
            height={"400px"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"md"}
            p={6}
          >
            <Heading>{w.name}</Heading>
            <Flex justify="flex-end">
              <Button onClick={() => {}} colorScheme="red" mt="40px" mr="10px">
                Delete
              </Button>
              <Button onClick={() => {}} colorScheme="teal" mt="40px">
                Run
              </Button>
            </Flex>
          </Box>
        ))}
      </Wrap>
    );
  }
  console.log("What are sources: ", sources);
  return (
    <Flex h="95vh" w="90vw" overflowX={"scroll"}>
      {sources.map((source, index) => {
        return (
          <WorkflowTile
            phaseId={source._additional.id}
            prevId={source[index - 1]?._additional?.id}
            key={index}
          />
        );
      })}
    </Flex>
  );
};

export default DataSources;
