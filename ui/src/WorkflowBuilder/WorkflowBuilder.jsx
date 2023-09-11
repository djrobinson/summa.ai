import React from 'react'
import {
  createWorkflow,
  createPhase,
  deleteWorkflow,
} from '../utils/weaviateServices'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'
import axios from 'axios'

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
} from '@chakra-ui/react'
import { useLazyQuery, gql } from '@apollo/client'
import { isEmpty } from 'lodash'

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
`

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
  return (
    <Heading>Workflow Tile</Heading>
  )
}

const WorkflowBuilder = () => {
  const [phases, setPhases] = React.useState([])
  const [schema, setSchema] = React.useState(null)
  const [types, setTypes] = React.useState({})
  const [workflowId, setWorkflowId] = React.useState(null)
  const [fetchWorkflows, { data, error, loading }] =
    useLazyQuery(FETCH_WORKFLOWS)
  console.log('workflows: ', data, error, loading)
  const [newWorkflowTitle, setNewWorkflowTitle] = React.useState('')
  const workflows = !isEmpty(data) ? data.Get.Workflow : []
  React.useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])
  const addPhase = async (p) => {
    const phaseId = await createPhase(workflowId, p)
    console.log('PRE PHASES: ', phases)
    setPhases([
      ...phases,
      {
        ...p,
        _additional: {
          id: phaseId,
        },
        mode: null,
        result: null,
      },
    ])
  }
  React.useEffect(() => {
    async function getSchema() {
      const res = await axios.post(
        'http://localhost:8080/v1/graphql',
        {
          query: getIntrospectionQuery(),
        },
      )
      const _schema = buildClientSchema(res.data.data)
      setSchema(_schema)
      setTypes(_schema._queryType._fields.Get.type._fields)
    }
    getSchema()
  }, [])
  if (isEmpty(phases)) {
    return (
      <Wrap>
        <Box
          m="10px"
          maxW={'400px'}
          w={'95%'}
          height={'400px'}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
        >
          <Heading>+ New Workflow</Heading>
          <Text mt="40px" p="5px">
            Workflows allow you to run complex reasoning tasks against
            various data sources using Open AI's GPT-4 model.
          </Text>
          <FormLabel size="xs">Workflow Name:</FormLabel>
          <Input
            value={newWorkflowTitle}
            onChange={(e) => setNewWorkflowTitle(e.target.value)}
          />
          <Flex justify="flex-end">
            <Button
              onClick={() => {
                createWorkflow(newWorkflowTitle)
              }}
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
            maxW={'400px'}
            w={'95%'}
            height={'400px'}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
          >
            <Heading>{w.name}</Heading>
            <Flex justify="flex-end">
              <Button
                onClick={() => {
                  deleteWorkflow(w._additional.id, fetchWorkflows)
                }}
                colorScheme="red"
                mt="40px"
                mr="10px"
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setWorkflowId(w._additional.id)
                  setPhases(w.phases)
                }}
                colorScheme="teal"
                mt="40px"
              >
                Run
              </Button>
            </Flex>
          </Box>
        ))}
      </Wrap>
    )
  }
  console.log('What are phases: ', phases)
  return (
    <Flex h="95vh" w="90vw" overflowX={'scroll'}>
      {phases.map((phase, index) => {
        return (
          <WorkflowTile
            phaseId={phase._additional.id}
            prevId={phases[index - 1]?._additional?.id}
            key={index}
          />
        )
      })}
    </Flex>
  )
}

export default WorkflowBuilder
