import React from "react";

import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { isEmpty, orderBy, sortBy } from "lodash";
import Flow from "../components/Flow";
import {
  createPhase,
  updatePhase as svcUpdatePhase,
} from "../utils/weaviateServices";
import PhaseRouter from "./PhaseRouter";
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
  const [editPhase, setEditPhase] = React.useState(null);

  const addPhase = async (p) => {
    const phaseId = await createPhase(workflowID, p);
    p._additional = { id: phaseId };
    console.log("FROM ADD PHASE: ", p);
    const newPhases = [...inMemoryPhases, { ...p }];
    setInMemoryPhases(newPhases);
  };
  let fullEditPhase = {};
  if (!isEmpty(editPhase)) {
    // TODO
    // Not ideal to do this! It's a sneaky bit of code that makes Phases not get props
    // you'd normally expect.
    // Eventual refactor: Need to handle updates a little differently to accomodate rels gracefully
    // But anyways - pick off stuff that can't be saved
    // upon update. This means it will be coupled with updatePhase below
    const phaseProps = [
      "type",
      "prompt",
      "selection",
      "workflow_step",
      "step_order",
      "source_id",
      "target_id",
      "filters",
      "searches",
      "limit",
    ];
    const fullEditPhaseMess = inMemoryPhases.filter(
      (imp) => imp._additional.id === editPhase
    )[0];
    phaseProps.forEach((k) => {
      if (fullEditPhaseMess[k]) {
        fullEditPhase[k] = fullEditPhaseMess[k];
      }
    });
    fullEditPhase._additional = { id: editPhase };
  }
  console.log("fullEditPhase ", fullEditPhase);
  const updatePhase = async (pid, p) => {
    const copiedPhase = { ...p };
    delete copiedPhase._additional;
    delete copiedPhase.searches;
    delete copiedPhase.filters;
    const phasesToCopy = [...inMemoryPhases];
    const removeCurrent = phasesToCopy.filter(
      (ptc) => ptc._additional.id !== pid
    );
    await svcUpdatePhase(pid, copiedPhase);

    p._additional = { id: pid };
    setInMemoryPhases([...removeCurrent, p]);
  };

  const allPs = phases.map(
    (phase) => `{
    path: ["id"],
    operator: Equal,
    valueText: "${phase._additional.id}",
  }`
  );
  const FETCH_PHASE_INTERMEDIATES = gql`
  query GetPhaseIntermediates {
    Get {
      Phase(where: { operator: Or, operands: [${allPs.join(",")}] }) {
        _additional {
          id
        }
        type
        prompt
        selection
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

  console.log("PHASES: ", data, error, loading);
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
    // TODO: CALCULATE Y BASED ON # OF PHASE ITEMS
    return {
      id: p._additional.id,
      type: "Node",
      draggable: false,
      data: {
        ...p,
        createOptions: setTempOptionPhases,
        addPhase: addPhase,
        updatePhase: updatePhase,
        setEditPhase: setEditPhase,
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
      const node = {
        id: `choose${nid}`,
        type: "Options",
        data: {
          label: "CHOOSE",
          workflow_step: imp.workflow_step + 1,
          step_order: imp.step_order + 0.5,
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
      id: "temp-choose-" + i,
      source: top.id.replace("choose", ""),
      target: top.id,
      animated: true,
      style: { stroke: "gray" },
    });
  });

  // I think much of this can move down to Flow once I figure out inputs

  const nodeCountPerLevel = nodes.reduce((acc, c) => {
    console.log("i nodeCountPerLevel", c);
    const newAcc = { ...acc };
    if (newAcc[c.data.workflow_step]) {
      newAcc[c.data.workflow_step]++;
      return newAcc;
    }
    newAcc[c.data.workflow_step] = 1;
    return newAcc;
  }, {});

  console.log("nodeCountPerLevel", nodeCountPerLevel);
  const levelCountKeys = Object.keys(nodeCountPerLevel);
  const stepOrderTracker = !isEmpty(nodeCountPerLevel)
    ? levelCountKeys.reduce(
        (acc, c) => ({
          ...acc,
          [c]: 1,
        }),
        {}
      )
    : {};
  const nodesOrdered = orderBy(nodes, (n) => n.data.step_order);
  nodesOrdered.forEach((n) => {
    n.data.step_order = stepOrderTracker[n.data.workflow_step];
    stepOrderTracker[n.data.workflow_step]++;
  });
  const levelCounts = Object.values(nodeCountPerLevel);
  const maxLevelCount = Math.max(...levelCounts);
  const BASE_ROW_HEIGHT = 180;
  const nodesWithPositions = nodesOrdered.map((n) => {
    const yMultiplier =
      (maxLevelCount * BASE_ROW_HEIGHT) /
      nodeCountPerLevel[n.data.workflow_step];
    const hasChoose = edges.some(
      (edg) => edg.id.includes("choose") && edg.source === n.id
    );
    console.log("SOURCE REERENCED: ", n);
    return {
      ...n,
      data: {
        ...n.data,
        hideBranch: hasChoose,
        stepCount: nodeCountPerLevel[n.data.workflow_step],
      },
      position: {
        x: n.data.workflow_step * 280 + 50,
        y: n.data.step_order * yMultiplier,
      },
    };
  });

  console.log("NODES: ", nodesWithPositions);
  console.log("EDGES: ", edges);

  return (
    <>
      <Stack>
        <Flex>
          <Button
            onClick={() => {
              setShowDataSource(true);
            }}
            pos="absolute"
            top="30px"
            left="40px"
            colorScheme="teal"
            size="xs"
            rounded="full"
            zIndex={2}
          >
            + New Data Source
          </Button>
          <Button
            pos="absolute"
            top="30px"
            right="60px"
            colorScheme="teal"
            size="xs"
            rounded="full"
          >
            Workflow Report
          </Button>
          <Flow nodes={nodesWithPositions} edges={edges} />
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
      {/* TODO: 2ND, 3RD MODALS WILL SHOW EDIT/READ MODES */}
      <Modal
        size="4xl"
        isOpen={!isEmpty(editPhase)}
        onClose={() => {
          setEditPhase(null);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <PhaseRouter
              phase={fullEditPhase}
              workflowID={workflowID}
              prevPhaseID={fullEditPhase.source_id}
              updatePhase={updatePhase}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Phases;
