import React from "react";

import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { GrAddCircle } from "react-icons/gr";
import CombineWizard from "./phases/CombineWizard";
import FilterSort from "./phases/FilterSort/FilterSort";
import MultiPromptWizard from "./phases/MultiPromptWizard";
import ReportWizard from "./phases/ReportWizard";
import SplitWizard from "./phases/SplitWizard";
import StaticDataSource from "./phases/StaticDataSource";

const PhaseRouter = ({ phase, prevPhaseID, workflowID, updatePhase }) => {
  const elements = [];
  if (phase.type === "DATA_SOURCE") {
    elements.push(
      <Box>
        <StaticDataSource phaseID={phase._additional.id} />
        <Flex p="20px" justify={"center"}>
          <Icon color="black" as={GrAddCircle} h="26px" w="26px" mr="10px" />
          <Text color="black" fontWeight="600" fontSize="18px">
            Add Another Data Source
          </Text>
        </Flex>
      </Box>
    );
  }
  if (phase.type === "FILTER_SORT") {
    elements.push(
      <FilterSort
        phase={phase}
        prevPhaseID={prevPhaseID}
        updatePhase={updatePhase}
      />
    );
  }
  if (phase.type === "LLM_PROMPT") {
    elements.push(
      <MultiPromptWizard
        phase={phase}
        phaseID={phase._additional.id}
        prevPhaseID={prevPhaseID}
        updatePhase={updatePhase}
      />
    );
  }
  if (phase.type === "COMBINE") {
    elements.push(
      <CombineWizard
        phase={phase}
        phaseID={phase._additional.id}
        prevPhaseID={prevPhaseID}
        updatePhase={updatePhase}
      />
    );
  }
  if (phase.type === "SPLIT") {
    elements.push(
      <SplitWizard
        phaseID={phase._additional.id}
        prevPhaseID={prevPhaseID}
        updatePhase={updatePhase}
      />
    );
  }
  if (phase.type === "REPORT") {
    elements.push(
      <ReportWizard
        phase={phase}
        phaseID={phase._additional.id}
        prevPhaseID={prevPhaseID}
        workflowID={workflowID}
        updatePhase={updatePhase}
      />
    );
  }
  return elements;
};

export default PhaseRouter;
