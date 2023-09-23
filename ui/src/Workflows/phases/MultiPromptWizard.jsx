import React from "react";
import md5 from "md5";
import {
  Box,
  Text,
  Stack,
  Heading,
  Button,
  Flex,
  Textarea,
  Wrap,
  WrapItem,
  FormLabel,
  TagLabel,
} from "@chakra-ui/react";
import { isValidLength } from "../../utils/tokenHelpers";
import { gql, useQuery } from "@apollo/client";
import { createObject, createRelationship } from "../../utils/weaviateServices";
import IntermediatesPreview from "../../components/IntermediatesPreview";
import { useRecoilState, useRecoilValue } from "recoil";
import { requestState, requestsState } from "../../recoil/atoms";


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

const PromptResults = ({ phaseID, i }) => {
  const request = useRecoilValue(requestState(phaseID + '-#' + i))
  return (
    <>
      <Text fontWeight="800">Prompt #{i + 1} Answers</Text>
      <Stack>

        <Text>{request.id}</Text>
        <Text>{request.status}</Text>
        <Text>{request.result}</Text>

      </Stack>
    </>
  );
};


const MultiPromptWizard = ({ phaseID, prevPhaseID }) => {
  const [summarizingPrompt, setSummarizingPrompt] = React.useState("");
  const [requests, setRequests] = useRecoilState(requestsState);
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
  console.log('currData ', currData)

  let contexts = [];
  if (data && data.Get.Phase[0].intermediates) {
    contexts = data.Get.Phase[0].intermediates.map((d,i) => {
      const prompt = summarizingPrompt + "\n" + d.text;
      const md5Prompt = md5(prompt);
      return {
        ...d,
        id: phaseID + "-#" + i,
        prompt: summarizingPrompt + "\n" + d.text,
        hash: md5Prompt,
      };
    });
  }
  return (
    <Box w="600px">
      <Heading>Multi Prompt Wizard</Heading>
      {currData && currData.Get.Phase[0].intermediates && (
        <IntermediatesPreview intermediates={currData.Get.Phase[0].intermediates} />)}
        <>
          <FormLabel>Summarizing Prompt:</FormLabel>
          <Textarea
            value={summarizingPrompt}
            onChange={(e) => setSummarizingPrompt(e.target.value)}
          />
          <Box h="530px" mt="10px" overflowY="scroll">
            {contexts &&
              contexts.slice(0, 100).map((d, i) => {
                return (
                  <Box mt="20px">
                    <Text fontWeight={"800"}>Prompt #{i + 1}</Text>

                    <Box bg={"gray.800"} p="20px" overflowY="scroll">
                      <Text key={i} color={"lime"}>
                        {d.prompt}
                      </Text>
                    </Box>
                    <PromptResults phaseID={phaseID} i={i} />
                  </Box>
                );
              })}
          </Box>
        </>
      <Flex>
        <Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={() => {
            setRequests([...requests, ...contexts])
          }}
        >
          Run Prompts
        </Button>
      </Flex>
    </Box>
  );
};

export default MultiPromptWizard;
