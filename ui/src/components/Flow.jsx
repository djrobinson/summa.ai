import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';
import Checkmark from './Checkmark';



const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e1-4', source: '1', target: '4' },
    { id: 'e1-5', source: '2', target: '5' },
    { id: 'e1-6', source: '3', target: '6' },
];



const Options = ({ data }) => {
    return (
        <Flex align={"center"}>
        <Box
          w={"250px"}
          rounded={"md"}
          p={6}
          align="center"
        >
          <Checkmark />
          <Text pt="10px" fontWeight="500">What's next:</Text>
          <Flex>
            <Button
                size="xs"
                w="50%"
                m="5px"
              mt={"10px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                data.addPhase({
                    'type': 'LLM_PROMPT'
                })
              }}
            >
              LLM Prompt
            </Button>
            <Button
                size="xs"
                w="50%"
                m="5px"
              mt={"10px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
              }}
            >
              Filter Text
            </Button>
          </Flex>
          <Flex>
            <Button
                size="xs"
                w="50%"
                m="5px"
              mt={"10px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
              }}
            >
              Categorize
            </Button>
            <Button
                size="xs"
                w="50%"
                m="5px"
              mt={"10px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
              }}
            >
              Add to Report
            </Button>
          </Flex>
        </Box>
        <Handle
            type="target"
            position={Position.Left}
            id="a"
            style={{ background: '#555' }}
            isConnectable={true}
        />
      </Flex>
    )
}

const Node = ({ data }) => {
    return (
        <Box border="solid 1px lightgray" bg="white" p="10px" align="center" justify="center">
            <Text>{data.label}</Text>
            <Text>{data.runState}</Text>
            <Stack>
                <Button size="xs">Edit</Button>
                <Flex>
                <Button size="xs">Split</Button>
                <Button size="xs">Delete</Button>
                </Flex>
            </Stack>

            <Handle
                type="target"
                position={Position.Left}
                id="a"
                style={{ background: '#555' }}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{  background: '#555' }}
                isConnectable={true}
            />
        </Box>
    )
}

const nodeTypes = {
    Node,
    Options
  };

export default function Flow({ nodes = [], edges = [] }) {
  const [renderNodes, setNodes, onNodesChange] = useNodesState([]);
  const [renderEdges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    setNodes(nodes)
  }, [nodes, setNodes])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <Box bg="white" style={{ width: 'calc(100vw - 290px)', height: 'calc(100vh - 120px)' }}>
      <ReactFlow
        nodes={renderNodes}
        edges={renderEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </Box>
  );
}