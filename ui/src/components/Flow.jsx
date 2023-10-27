import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { FaEdit, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdOutlineChromeReaderMode } from "react-icons/md";
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
import CategorizeNode from "./flows/CategorizeNode";
import CombineNode from "./flows/CombineNode";
import DataSourceNode from "./flows/DataSourceNode";
import FilterNode from "./flows/FilterNode";
import LLMPrompNode from "./flows/LLMPromptNode";
import ReportNode from "./flows/ReportNode";
import SplitNode from "./flows/SplitNode";

const Options = (props) => {
  const { data } = props;
  const fixedId = props.id.replace("choose", "");
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
              data.addPhase({
                type: "LLM_PROMPT",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
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
            onClick={() => {
              data.addPhase({
                type: "FILTER_SORT",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });
            }}
          >
            Filter
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
            onClick={() => {
              data.addPhase({
                type: "CATEGORIZE",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });
            }}
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
            onClick={() => {
              data.addPhase({
                type: "REPORT",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });
            }}
          >
            Add to Report
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
            onClick={() => {
              data.addPhase({
                type: "SPLIT",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });
            }}
          >
            Split
          </Button>
          <Button
            size="xs"
            w="50%"
            m="5px"
            mt={"5px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => {
              data.addPhase({
                type: "COMBINE",
                workflow_step: data.workflow_step,
                step_order: data.step_order,
                source_id: fixedId,
              });
            }}
          >
            Combine
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

const NODE_TYPES = {
  LLM_PROMPT: LLMPrompNode,
  DATA_SOURCE: DataSourceNode,
  FILTER_SORT: FilterNode,
  REPORT: ReportNode,
  CATEGORIZE: CategorizeNode,
  COMBINE: CombineNode,
  SPLIT: SplitNode,
};

const Node = (n) => {
  const { data } = n;
  const Component = NODE_TYPES[data.type];
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
        <Component {...data} />
        <Flex align="center" justify="center">
          <IconButton
            onClick={() => {
              data.setEditPhase(n.id);
            }}
            size="sm"
            bg="white"
            icon={
              <Icon zIndex={6} color="yellow.700" as={FaEdit} w={5} h={5} />
            }
          />
          <IconButton
            size="sm"
            bg="white"
            icon={
              <Icon
                zIndex={6}
                color="gray.800"
                as={MdOutlineChromeReaderMode}
                w={6}
                h={6}
              />
            }
          />
          <IconButton
            size="sm"
            bg="white"
            icon={<Icon zIndex={6} color="teal.400" as={FaPlay} w={5} h={5} />}
          />
          <IconButton
            size="sm"
            bg="white"
            p="0"
            m="0"
            icon={<Icon zIndex={6} color="maroon" as={FaStop} w={5} h={5} />}
          />

          <IconButton
            size="sm"
            bg="white"
            icon={<Icon zIndex={6} color="red.600" as={FaTrash} w={5} h={5} />}
          />
        </Flex>

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
            const stepOrder = data.step_order + 1.5;
            data.createOptions((prev) => [
              ...prev,
              {
                id: `choose${n.id}`,
                type: "Options",
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
      style={{ width: "calc(100vw)", height: "calc(100vh - 160px)" }}
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
