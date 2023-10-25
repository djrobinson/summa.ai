import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import Checkmark from "./Checkmark";

const Options = (props) => {
  const { data } = props;
  console.log("WHAT props: ", props);
  return (
    <Flex align={"center"}>
      <Box rounded={"md"} align="center">
        <Flex mb="10px" justify="space-around" align="center">
          <Checkmark />
          <Text fontWeight="500">What's Next:</Text>
        </Flex>
        <Flex>
          <Button
            size="xs"
            w="50%"
            m="5px"
            mt={"5px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => {
              const fixedId = props.id.replace("choose", "");
              console.log("fixedId ", fixedId);
              data.addPhase({
                type: "LLM_PROMPT",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });

              data.createOptions((prev) => {
                const removed = prev.filter((p) => p.id !== props.id);
                console.log("HERE WE IS ", removed, props.id);
                return removed;
              });
            }}
          >
            LLM Prompt
          </Button>
          <Button
            size="xs"
            w="50%"
            m="5px"
            mt={"5px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => {}}
          >
            Filter Text
          </Button>
        </Flex>
        <Flex>
          <Button
            size="xs"
            w="50%"
            m="5px"
            mt={"5px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => {}}
          >
            Categorize
          </Button>
          <Button
            size="xs"
            w="50%"
            m="5px"
            mt={"5px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => {}}
          >
            Add to Report
          </Button>
        </Flex>
      </Box>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ background: "#555" }}
        isConnectable={true}
      />
    </Flex>
  );
};

const Node = (n) => {
  const { data } = n;
  return (
    <>
      <Box
        border={
          data.runState === "RUNNABLE" ? "solid 2px green" : "solid 1px gray"
        }
        bg="white"
        p="10px"
        align="center"
        justify="center"
      >
        <Text>{data.label}</Text>
        <Stack>
          <Button size="xs">Edit</Button>

          <Button size="xs">Delete</Button>
        </Stack>

        <Handle
          type="target"
          position={Position.Left}
          id="a"
          style={{ background: "#555" }}
          isConnectable={true}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="b"
          style={{ background: "#555" }}
          isConnectable={true}
        />
      </Box>
      {/* Show only if we have target id */}
      {!data.hideBranch && (
        <Button
          onClick={() => {
            const workflowStep = data.workflow_step + 1;
            const stepOrder = data.step_order + 1;
            // TODO: CALCULATE Y BASED ON # OF PHASE ITEMS
            data.createOptions((prev) => [
              ...prev,
              {
                id: `choose${n.id}`,
                type: "Options",
                position: {
                  x: workflowStep * 275,
                  y: stepOrder * 150,
                },
                data: {
                  label: "CHOOSE",
                  workflow_step: workflowStep,
                  step_order: stepOrder,
                  addPhase: data.addPhase,
                  createOptions: data.createOptions,
                },
                sourcePosition: "right",
                targetPosition: "left",
              },
            ]);
          }}
          mt="10px"
          w="full"
          pos="absolute"
          size="xs"
        >
          + Branch
        </Button>
      )}
    </>
  );
};

const nodeTypes = {
  Node,
  Options,
};

export default function Flow({ nodes = [], edges = [] }) {
  const [renderNodes, setNodes, onNodesChange] = useNodesState([]);
  const [renderEdges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <Box
      bg="white"
      style={{ width: "calc(100vw - 290px)", height: "calc(100vh - 160px)" }}
    >
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
