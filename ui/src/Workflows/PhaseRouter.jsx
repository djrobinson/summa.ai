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
import StaticDataSource from "./phases/StaticDataSource";
import FilterSort from "./phases/FilterSort/FilterSort";
import MultiPromptWizard from "./phases/MultiPromptWizard";
import CombineWizard from "./phases/CombineWizard";
import SplitWizard from "./phases/SplitWizard";
import ReportWizard from "./phases/ReportWizard";

const PhaseRouter = ({ phase, prevPhaseID, workflowID}) => {
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
            prevPhaseID={prevPhaseID}
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
            phase={phase}
            phaseID={phase._additional.id}
            prevPhaseID={prevPhaseID}
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
            phase={phase}
            phaseID={phase._additional.id}
            prevPhaseID={prevPhaseID}
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
            prevPhaseID={prevPhaseID}
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
            phase={phase}
            phaseID={phase._additional.id}
            prevPhaseID={prevPhaseID}
            workflowID={workflowID}
          />
        </Box>
      );
    }
    elements.push(
      <Flex w="120px" h="800px" align="center" justify="center">
        <Stack>
          <Icon as={BsArrowRight} h="40px" w="120px" />
        </Stack>
      </Flex>
    );
    return elements;
  
}

export default PhaseRouter