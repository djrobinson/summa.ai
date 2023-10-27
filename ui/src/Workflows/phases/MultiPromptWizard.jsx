import { gql, useQuery } from "@apollo/client";
import { Box, Button, Flex, FormLabel, Text, Textarea } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import PromptControls from "../../RequestManager/PromptControls";
import IntermediatesPreview from "../../components/IntermediatesPreview";
import { requestsState } from "../../recoil/atoms";

export const GET_INTERMEDIATES = gql`
  query GetIntermediates($id: String!) {
    Get {
      Phase(where: { path: "id", operator: Equal, valueString: $id }) {
        intermediates {
          ... on Intermediate {
            _additional {
              id
            }
            text
          }
        }
      }
    }
  }
`;

const MultiPromptWizard = ({ phase, phaseID, prevPhaseID, updatePhase }) => {
  const multiPrompt = phase.prompt;
  console.log("MULTIPROMPT PHASE: ", multiPrompt);
  const [summarizingPrompt, setSummarizingPrompt] = React.useState(multiPrompt);
  const [requests, setRequests] = useRecoilState(requestsState);
  const [showManager, setShowManager] = React.useState(false);
  const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
    variables: {
      id: prevPhaseID,
    },
  });
  const {
    data: currData,
    error: currError,
    loading: currLoading,
  } = useQuery(GET_INTERMEDIATES, {
    variables: {
      id: phaseID,
    },
  });
  console.log("currData ", currData);

  let contexts = [];
  if (data && data.Get.Phase[0].intermediates) {
    contexts = data.Get.Phase[0].intermediates.map((d, i) => {
      return {
        // Note: I commented ...d and haven't tested it! It might break something in atoms.js
        // ...d,
        id: d._additional.id,
        prompt: summarizingPrompt,
        context: d.text,
        phaseID: phaseID,
      };
    });
  }
  console.log("CONTEXTS: ", contexts);
  return (
    <Box w="600px">
      <>
        <FormLabel>Summarizing Prompt:</FormLabel>
        <Textarea
          value={summarizingPrompt}
          onChange={(e) => setSummarizingPrompt(e.target.value)}
        />
        {currData && currData.Get.Phase[0].intermediates ? (
          <Box h="530px" mt="10px" overflowY="scroll">
            <IntermediatesPreview
              intermediates={currData.Get.Phase[0].intermediates}
            />
          </Box>
        ) : (
          <Box h="530px" mt="10px" overflowY="scroll">
            {contexts &&
              contexts.slice(0, 100).map((d, i) => {
                if (showManager) {
                  return (
                    <Box mt="20px">
                      <PromptControls id={d.id} prompt={d.prompt} />
                    </Box>
                  );
                }

                return (
                  <Box mt="20px">
                    <Text fontWeight={"800"}>Prompt {i + 1} Preview</Text>
                    <Box bg={"gray.800"} p="20px" overflowY="scroll">
                      <Text key={i} color={"lime"}>
                        {d.prompt} {d.context}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        )}
      </>
      <Flex>
        <Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={async () => {
            const copiedPhase = { ...phase };
            const updatedPhase = {
              ...copiedPhase,
              prompt: summarizingPrompt,
            };
            console.log("updatedPhase ", updatedPhase);
            await updatePhase(phase._additional.id, updatedPhase);
            // setShowManager(true)
            // setRequests([...requests, ...contexts])
          }}
        >
          Run Prompts
        </Button>
      </Flex>
    </Box>
  );
};

export default MultiPromptWizard;
