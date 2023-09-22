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
import { useRecoilState } from "recoil";
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

const runPrompt = async (prompt, phaseID, contextID) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
      }),
    };
    const response1 = await fetch(
      "https://kdcwpoii3h.execute-api.us-west-2.amazonaws.com/dev/chat",
      requestOptions
    );
    const res = await response1.json();
    if (!res.choices) {
      return "";
    }
    const objRes = await createObject("Intermediate", {
      text: res.choices[0].message.content,
    });
    await createRelationship(
      "Phase",
      phaseID,
      "intermediates",
      "Intermediate",
      objRes.id,
      "phase"
    );
    await createRelationship(
      "Intermediate",
      contextID,
      "sourceFor",
      "Intermediate",
      objRes.id,
      "source"
    );
    console.log("created rel for AI result");
    return res.choices[0].message.content;
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
};

const PromptRunner = ({ phaseID, i, prompt, contextID, setCount }) => {
  console.log(phaseID, i, prompt, contextID, setCount);
  const [result, setResult] = React.useState("");
  // React.useEffect(() => {
  //   const go = async () => {
  //     try {
  //       const res = await runPrompt(prompt, phaseID, contextID);
  //       setResult(res);
  //       setCount((c) => c + 1);
  //     } catch (e) {
  //       console.log("DIDNT WORK: ", e);
  //     }
  //   };
  //   go();
  // }, [prompt, phaseID, contextID, i, setCount]);
  return (
    <>
      <Text fontWeight="800">Prompt #{i + 1} Answers</Text>
      <Wrap>
        <WrapItem>
          <Text>{result}</Text>
        </WrapItem>
      </Wrap>
    </>
  );
};


const MultiPromptWizard = ({ phaseID, prevPhaseID }) => {
  const [summarizingPrompt, setSummarizingPrompt] = React.useState("");
  const [requests, setRequests] = useRecoilState(requestsState);
  const [step, setStep] = React.useState(0);
  const [count, setCount] = React.useState(1);
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
    contexts = data.Get.Phase[0].intermediates.map((d) => {
      const prompt = summarizingPrompt + "\n" + d.text;
      const md5Prompt = md5(prompt);
      return {
        ...d,
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