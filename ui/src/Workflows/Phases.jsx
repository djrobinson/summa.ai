import React from "react";

import { GrAddCircle } from "react-icons/gr";
import { AiOutlineArrowRight } from "react-icons/ai";
import { GoGitBranch } from "react-icons/go";
import { BsArrowRight } from "react-icons/bs";
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
  Icon,
  Stack,
  Code,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty, sortBy } from "lodash";
import StaticDataSource from "./phases/StaticDataSource";
import Checkmark from "../components/Checkmark";
import FilterSort from "./phases/FilterSort/FilterSort";
import MultiPromptWizard from "./phases/MultiPromptWizard";
import { createPhase } from "../utils/weaviateServices";
import CombineWizard from "./phases/CombineWizard";
import SplitWizard from "./phases/SplitWizard";
import ReportWizard from "./phases/ReportWizard";
import Flow from "../components/Flow";

// PHASE RULES
// The phases have 2 common properties
// prevId - will grab the prev weaviate intermediates or s3 object
// phaseID - will be used to name the weaviate intermediates or s3 object

// top level is simply responsible for creation & display of phases
// the phase will handle its own data & updates
// opt for redundant fetches over complex state management

// s3 objects will be named based on phase id. Shouldn't have to store this on the Phase

const Phases = ({ phases, workflowID }) => {
  const [inMemoryPhases, setInMemoryPhases] = React.useState([]);
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
    const newPhases = [...inMemoryPhases, {...p }]
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
        order
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
      const sortedPhases = sortBy(data.Get.Phase, 'order')
      setInMemoryPhases(sortedPhases);
    }
  }, [data]);

  const nodes = inMemoryPhases.map((p, i) => {
    return ({
      id: p._additional.id,
      type: 'Node',
      position: {
        x: i * 180 + 50,
        y: 250
      },
      data: {
        label: p.type,
        runState: p.intermediates && p.intermediates.length ? 'RUNNABLE' : 'NOT RUNNABLE'
      }
    })
  })
  
  nodes.push({
    id: 'choose',
    type: 'Options',
    position: {
      x: inMemoryPhases.length * 180 + 50,
      y: 200
    },
    data: {
      label: 'CHOOSE',
      addPhase
    }
  })


  return (
    <Flex>
      <Button pos="absolute" top="40px" left="40px" colorScheme="teal" size="xs" rounded="full">+ New Data Source</Button>
      <Flow nodes={nodes} edges={[]} />
    </Flex>
  );
};

export default Phases;
