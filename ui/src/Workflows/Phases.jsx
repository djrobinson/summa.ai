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
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import StaticDataSource from "./phases/StaticDataSource";
import Checkmark from "../components/Checkmark";
import FilterSort from "./phases/FilterSort/FilterSort";
import MultiPromptWizard from "./phases/MultiPromptWizard";
import { createPhase } from "../utils/weaviateServices";
import CombineWizard from "./phases/CombineWizard";
import SplitWizard from "./phases/SplitWizard";
import ReportWizard from "./phases/ReportWizard";

// PHASE RULES
// The phases have 2 common properties
// prevId - will grab the prev weaviate intermediates or s3 object
// phaseID - will be used to name the weaviate intermediates or s3 object

// top level is simply responsible for creation & display of phases
// the phase will handle its own data & updates
// opt for redundant fetches over complex state management

// s3 objects will be named based on phase id. Shouldn't have to store this on the Phase

const optionsBuilder = (phase) => {};

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
    console.log("PRE PHASES: ", phases);
    p._additional = { id: phaseId };
    const newPhases = [...inMemoryPhases, {...p }]
    console.log("POST PHASES: ", newPhases);
    setInMemoryPhases(newPhases);
  };
  console.log('${allPs.join(",") ', allPs.join(","));
  const FETCH_PHASE_INTERMEDIATES = gql`
  query GetPhaseIntermediates {
    Get {
      Phase(where: { operator: Or, operands: [${allPs.join(",")}] }) {
        _additional {
          id
        }
        type
      }
    }
  }
`;
  console.log("FETCH_PHASE_INTERMEDIATES ", FETCH_PHASE_INTERMEDIATES);

  const { data, error, loading } = useQuery(FETCH_PHASE_INTERMEDIATES);

  console.log("Workflow: ", data, error, loading);
  React.useEffect(() => {
    if (!isEmpty(data)) {
      setInMemoryPhases(data.Get.Phase);
    }
  }, [data]);

  return (
    <Flex overflowX="scroll">
      {inMemoryPhases.map((phase, i) => {
        const elements = [];
        if (phase.type === "DATA_SOURCE") {
          elements.push(
            <Box>
              <Box
                m="10px"
                w={"700px"}
                height={"800px"}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                p={6}
              >
                <StaticDataSource
                  phaseID={phase._additional.id}
                />
              </Box>
              <Box>
                <Flex p="20px" justify={"center"}>
                  <Icon
                    color="black"
                    as={GrAddCircle}
                    h="26px"
                    w="26px"
                    mr="10px"
                  />
                  <Text color="black" fontWeight="600" fontSize="18px">
                    Add Another Data Source
                  </Text>
                </Flex>
              </Box>
            </Box>
          );
        }
        if (phase.type === "FILTER_SORT") {
          elements.push(
            <Box
              m="10px"
              w={"700px"}
              height={"800px"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
            >
              <FilterSort
                phase={phase}
                prevPhaseID={inMemoryPhases[i - 1]._additional.id}
              />
            </Box>
          );
        }
        if (phase.type === "LLM_PROMPT") {
          elements.push(
            <Box
              m="10px"
              w={"700px"}
              height={"800px"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
            >
              <MultiPromptWizard
                phaseID={phase._additional.id}
                prevPhaseID={inMemoryPhases[i - 1]._additional.id}
              />
            </Box>
          );
        }
        if (phase.type === "COMBINE") {
          elements.push(
            <Box
              m="10px"
              w={"700px"}
              height={"800px"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
            >
              <CombineWizard
                phaseID={phase._additional.id}
                prevPhaseID={inMemoryPhases[i - 1]._additional.id}
              />
            </Box>
          );
        }
        if (phase.type === "SPLIT") {
          elements.push(
            <Box
              m="10px"
              w={"700px"}
              height={"800px"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
            >
              <SplitWizard
                phaseID={phase._additional.id}
                prevPhaseID={inMemoryPhases[i - 1]._additional.id}
              />
            </Box>
          );
        }
        if (phase.type === "REPORT") {
          elements.push(
            <Box
              m="10px"
              w={"700px"}
              height={"800px"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
            >
              <ReportWizard
                phaseID={phase._additional.id}
                prevPhaseID={inMemoryPhases[i - 1]._additional.id}
                workflowID={workflowID}
                />
            </Box>
          );
        }
        elements.push(
          <Flex w="120px" h="800px" align="center" justify="center">
            <Stack>
              <Icon as={BsArrowRight} h="40px" w="120px" />
              {/* <Stack align="center" justify="center">
                <Icon
                  color="black"
                  as={GoGitBranch}
                  h="20px"
                  w="20px"
                  mt="80px"
                />
                <Text align="center">Split Workstream</Text>
              </Stack> */}
            </Stack>
          </Flex>
        );
        return elements;
      })}

      <Flex h={"700px"} w="400px" align={"center"}>
        <Box
          m="10px"
          w={"300px"}
          height={"300px"}
          rounded={"md"}
          p={6}
          align="center"
        >
          <Checkmark />
          <Text pt="10px">What's next:</Text>
          <Flex>
            <Button
              mt={"20px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                addPhase({
                  type: "LLM_PROMPT",
                });
              }}
            >
              Create LLM Prompt
            </Button>
          </Flex>
          <Flex>
            <Button
              mt={"20px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                addPhase({
                  type: "FILTER_SORT",
                });
              }}
            >
              Filter, Sort, or Restructure Text
            </Button>
          </Flex>
          <Flex>
            <Button
              mt={"20px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                addPhase({
                  type: "SPLIT",
                });
              }}
            >
              Split Text
            </Button>
          </Flex>
          <Flex>
            <Button
              mt={"20px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                addPhase({
                  type: "COMBINE",
                });
              }}
            >
              Combine Text
            </Button>
          </Flex>
          <Flex>
            <Button
              mt={"20px"}
              colorScheme="teal"
              rounded={"full"}
              flex={"1 0 auto"}
              onClick={() => {
                addPhase({
                  type: "REPORT",
                });
              }}
            >
              Create Report
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Phases;
