import React from "react";
import {
  deleteWorkflow,
  createObject,
  createRelationship,
} from "../utils/weaviateServices";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import axios from "axios";

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
  Select,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { FETCH_DATA_SOURCE, FETCH_DATA_SOURCES } from "./phases/DataSourceSelector";
import { FETCH_WORKFLOW } from "./Workflow";

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

const copyWorkflow = async (newWorkflowTitle, workflowToCopy, templateDataSource) => {
  const wf = await createObject("Workflow", {
    name: newWorkflowTitle,
  });
  console.log('CREATE WORKFLOW: ', wf)
  await workflowToCopy.forEach(async (phaseToCopy) => {
    delete phaseToCopy._additional
    // if DATA_SOURCE, replace with templateDataSource
    const phaseResult = await createObject("Phase", {
      ...phaseToCopy
    })
    console.log('PHASE RESULT: ', phaseResult)
    await createRelationship(
      "Workflow",
      wf.id,
      "phases",
      "Phase",
      phaseResult.id,
      "workflow"
    );
  })
  console.log('successfully copied workflow!!!')
  return wf.id
}

const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const [phases, setPhases] = React.useState([]);
  const [schema, setSchema] = React.useState(null);
  const [types, setTypes] = React.useState({});
  const [workflowToCopy, setWorkflowToCopy] = React.useState([])
  const [newWorkflowTitle, setNewWorkflowTitle] = React.useState("");
  const [copiedWorkflowTitle, setCopiedWorkflowTitle] = React.useState("");
  const [fetchWorkflows, { data, error, loading }] =
    useLazyQuery(FETCH_WORKFLOWS);
  const [fetchCopyWorkflow, { data: copyWorkflowData, error: errorWorkflowData, loading: loadingWorkflowData }] =
  useLazyQuery(FETCH_WORKFLOW, {
    variables: { id: workflowToCopy },
  });
  const { data: dataSourceData, error: dataSourceError, loading: dataSourceLoading } = useQuery(FETCH_DATA_SOURCES)
  console.log("workflows: ", data, error, loading);
  console.log("dataSourceData: ", dataSourceData);
  console.log("copyWorkflowData: ", copyWorkflowData);
  const copiedWorkflow = !isEmpty(copyWorkflowData) && !isEmpty(copyWorkflowData.Get.Workflow) ? copyWorkflowData.Get.Workflow[0].phases : []
  console.log("copiedWorkflow: ", copiedWorkflow);
  const workflows = !isEmpty(data) ? data.Get.Workflow : [];
  const dataSources = !isEmpty(dataSourceData) ? dataSourceData.Get.DataSource : []
  React.useEffect(() => {
    fetchCopyWorkflow()
  }, [workflowToCopy, fetchCopyWorkflow])
  React.useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  React.useEffect(() => {
    async function getSchema() {
      const res = await axios.post("http://localhost:8080/v1/graphql", {
        query: getIntrospectionQuery(),
      });
      const _schema = buildClientSchema(res.data.data);
      setSchema(_schema);
      setTypes(_schema._queryType._fields.Get.type._fields);
    }
    getSchema();
  }, []);
  if (isEmpty(phases)) {
    return (
      <Wrap>
        <Box
          m="10px"
          maxW={"340px"}
          w={"95%"}
          height={"340px"}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
        >
          <Text fontWeight="800">+ New Workflow</Text>
          <Text mt="40px" p="5px">
            Workflows allow you to run complex reasoning tasks against various
            data sources using Open AI's GPT-4 model.
          </Text>
          <FormLabel size="xs">Workflow Name:</FormLabel>
         
          <Flex justify="flex-end">
          <Input
            placeholder="Name..."
            value={newWorkflowTitle}
            onChange={(e) => setNewWorkflowTitle(e.target.value)}
          />
            <Button
              ml="10px"
              onClick={async () => {
                const wf = await createObject("Workflow", {
                  name: newWorkflowTitle,
                });
                console.log("NEW WF: ", `/workflows/${wf.id}`);
                navigate(`/workflows/${wf.id}`);
              }}
              colorScheme="teal"
              alignSelf="end"
            >
              Create
            </Button>
          </Flex>
        </Box>
        <Box
          m="10px"
          maxW={"340px"}
          w={"95%"}
          height={"340px"}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
        >
          <Text fontWeight="800">+ Create from Template</Text>
          <FormLabel size="xs">Template:</FormLabel>
          <Select
            placeholder="Copy from Workfow..."
            onChange={(e) => {
                setWorkflowToCopy(e.target.value)
            }}
            value={workflowToCopy}
          >
            {workflows.map((k) => (
              <option value={k._additional.id}>{k.name}</option>
            ))}
          </Select>
          <FormLabel size="xs">Data Source
          </FormLabel>
          <Select
            placeholder="Template..."
            onChange={(e) => {

            }}

          >
            {dataSources.map((k) => (
              <option value={k._additional.id}>{k.name}</option>
            ))}
          </Select>
          <FormLabel pt="10px" size="xs">Workflow Name:</FormLabel>
          
          <Flex justify="flex-end">
          <Input
            placeholder="Name..."
            value={copiedWorkflowTitle}
            onChange={(e) => setCopiedWorkflowTitle(e.target.value)}
          />
            <Button
              ml="10px"
              onClick={async () => {
                const wf = await copyWorkflow(copiedWorkflowTitle, copiedWorkflow, null)
                console.log("NEW WF: ", `/workflows/${wf}`);

                navigate(`/workflows/${wf}`);
              }}
              colorScheme="teal"
              alignSelf="end"
            >
              Create
            </Button>
          </Flex>
          
        </Box>
        {workflows.map((w) => (
          <Box
            m="10px"
            maxW={"340px"}
            w={"95%"}
            height={"340px"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            rounded={"md"}
            p={6}
          >
            <Text fontSize="xl" fontWeight="bold">{w.name}</Text>
            <Text pt="30px" align="justify">{w.description}</Text>
            <Flex pt="30px" justify="space-around">
              <Button size="sm"
                onClick={() => {
                  deleteWorkflow(w._additional.id, fetchWorkflows);
                }}
                colorScheme="red"
              >
                Delete
              </Button>
              <Button size="sm" bg="teal" color="white">
              <Link to={`${w._additional.id}`}  mt="40px">
                Edit
              </Link>
              </Button>
            </Flex>
          </Box>
        ))}
      </Wrap>
    );
  }
  console.log("What are phases: ", phases);
  return (
    <Flex h="95vh" w="90vw" overflowX={"scroll"}>
      {phases.map((phase, index) => {
        return (
          <WorkflowTile
            phaseId={phase._additional.id}
            prevId={phases[index - 1]?._additional?.id}
            key={index}
          />
        );
      })}
    </Flex>
  );
};

export default WorkflowBuilder;
