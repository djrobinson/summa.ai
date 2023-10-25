import React from "react";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { isEmpty, sortBy } from "lodash";
import { FaPlay, FaRegSave, FaStop } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import Flow from "../components/Flow";
import { createPhase } from "../utils/weaviateServices";
import DataSourceSelector from "./phases/DataSourceSelector";

// PHASE RULES
// The phases have 2 common properties
// prevId - will grab the prev weaviate intermediates or s3 object
// phaseID - will be used to name the weaviate intermediates or s3 object

// top level is simply responsible for creation & display of phases
// the phase will handle its own data & updates
// opt for redundant fetches over complex state management

// s3 objects will be named based on phase id. Shouldn't have to store this on the Phase

const Phases = ({ phases, workflowID, workflowTitle }) => {
  const [inMemoryPhases, setInMemoryPhases] = React.useState([]);
  const [tempOptionPhases, setTempOptionPhases] = React.useState([]);
  const [showDataSource, setShowDataSource] = React.useState(false);
  const allPs = phases.map(
    (phase) => `{
    path: ["id"],
    operator: Equal,
    valueText: "${phase._additional.id}",
  }`
  );
  const addPhase = async (p) => {
    const phaseId = await createPhase(workflowID, p);
    p._additional = { id: phaseId };
    const newPhases = [...inMemoryPhases, { ...p }];
    setInMemoryPhases(newPhases);
  };
  const FETCH_PHASE_INTERMEDIATES = gql`
  query GetPhaseIntermediates {
    Get {
      Phase(where: { operator: Or, operands: [${allPs.join(",")}] }) {
        _additional {
          id
        }
        type
        prompt
        workflow_step
        step_order
        source_id
        target_id
        intermediates {
          ... on Intermediate {
            _additional {
              id
            }
          }
        }
        filters {
          ... on Filter {
            operator
            objectPath
            value
          }
        }
        searches {
          ... on Search {
            objectPath
            value
          }
        }
        sorts {
          ... on Sort {
            objectPath
            order
          }
        }
        limit
      }
    }
  }
`;

  const { data, error, loading } = useQuery(FETCH_PHASE_INTERMEDIATES);

  console.log("Workflow: ", data, error, loading);
  React.useEffect(() => {
    if (!isEmpty(data)) {
      const sortedPhases = sortBy(data.Get.Phase, "order");
      setInMemoryPhases(sortedPhases);
    }
  }, [data]);
  let dataSourceCount = 0;
  inMemoryPhases.forEach((imp) => {
    if (imp.type === "DATA_SOURCE") {
      dataSourceCount++;
    }
  });
  const edges = [];
  inMemoryPhases.forEach((imp) => {
    if (imp.source_id) {
      edges.push({
        id: `${imp.source_id}-${imp.id}`,
        source: imp.source_id,
        target: imp._additional.id,
        animated: true,
        style: { stroke: "gray" },
      });
    }
  });
  const nodes = inMemoryPhases.map((p, i) => {
    const sourceReferenced = edges.some(
      (edg) => edg.source === p._additional.id
    );
    // TODO: CALCULATE Y BASED ON # OF PHASE ITEMS
    return {
      id: p._additional.id,
      type: "Node",
      position: {
        x: p.workflow_step * 280 + 50,
        y: p.step_order * 150,
      },
      data: {
        label: p.type,
        workflow_step: p.workflow_step,
        step_order: p.step_order,
        source_id: p.source_id,
        hideBranch: !sourceReferenced,
        createOptions: setTempOptionPhases,
        addPhase: addPhase,
        runState:
          p.intermediates && p.intermediates.length
            ? "RUNNABLE"
            : "NOT RUNNABLE",
      },
      sourcePosition: "right",
      targetPosition: "left",
    };
  });

  inMemoryPhases.forEach((imp) => {
    const nid = imp._additional.id;
    const sourceReferenced = edges.some(
      (edg) => edg.source === imp._additional.id
    );
    if (!sourceReferenced) {
      imp.hideBranch = true;
      // TODO: CALCULATE Y BASED ON # OF PHASE ITEMS
      const node = {
        id: `choose${nid}`,
        type: "Options",
        position: {
          x: (imp.workflow_step + 1) * 280 + 50,
          y: imp.step_order * 146,
        },
        data: {
          label: "CHOOSE",
          workflow_step: imp.workflow_step + 1,
          step_order: imp.step_order,
          createOptions: setTempOptionPhases,
          addPhase,
        },
        sourcePosition: "right",
        targetPosition: "left",
      };
      nodes.push(node);
      const edge = {
        id: `${nid}-choose`,
        source: nid,
        target: `choose${nid}`,
        animated: true,
        style: { stroke: "gray" },
      };
      edges.push(edge);
    }
  });

  tempOptionPhases.forEach((top, i) => {
    nodes.push(top);
    edges.push({
      id: "temp-options-" + i,
      source: top.id.replace("choose", ""),
      target: top.id,
      animated: true,
      style: { stroke: "gray" },
    });
  });

  console.log("NODES: ", nodes);
  console.log("EDGES: ", edges);

  return (
    <>
      <Stack>
        <Flex justify="space-between" align="center">
          <Heading size="lg" fontWeight="300" color="teal.600">
            {workflowTitle}
          </Heading>
          <Box mr="30px">
            <Icon m="8px" color="teal.400" as={FaPlay} w={5} h={5} />
            <Icon m="8px" color="maroon" as={FaStop} w={5} h={5} />
            <Icon m="8px" color="teal.700" as={FiRefreshCcw} w={5} h={5} />
            <Icon m="8px" color="teal.700" as={FaRegSave} w={5} h={5} />
          </Box>
        </Flex>

        <Flex>
          <Button
            onClick={() => {
              setShowDataSource(true);
            }}
            zIndex={2}
            pos="absolute"
            top="90px"
            left="40px"
            colorScheme="teal"
            size="xs"
            rounded="full"
          >
            + New Data Source
          </Button>
          <Button
            zIndex={2}
            pos="absolute"
            top="90px"
            right="60px"
            colorScheme="teal"
            size="xs"
            rounded="full"
          >
            Workflow Report
          </Button>
          <Flow nodes={nodes} edges={edges} />
        </Flex>
      </Stack>
      <Modal
        size="4xl"
        isOpen={showDataSource}
        onClose={() => {
          setShowDataSource(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <DataSourceSelector
              id={workflowID}
              addPhase={(val) => setInMemoryPhases([...inMemoryPhases, val])}
              dataSourceCount={dataSourceCount}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Phases;
