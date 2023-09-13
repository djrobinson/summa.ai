import React from "react";

import {
  Wrap,
  Flex,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Progress,
  Stack,
} from "@chakra-ui/react";
import { createObject, createRelationship } from "../utils/weaviateServices";
import { isEmpty } from "lodash";

const runPrompt = async (prompt) => {
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
    console.log("What is res: ", res);
    if (!res.choices) {
      return "";
    }
    // const objRes = await createObject("Intermediate", {
    //   text: res.choices[0].message.content,
    // });
    // await createRelationship(
    //   "Phase",
    //   phaseID,
    //   "intermediates",
    //   "Intermediate",
    //   objRes.id,
    //   "phase"
    // );
    // await createRelationship(
    //   "Intermediate",
    //   contextID,
    //   "sourceFor",
    //   "Intermediate",
    //   objRes.id,
    //   "source"
    // );
    // console.log("created rel for AI result");
    return res.choices[0].message.content;
  } catch (e) {
    console.error("COULD NOT SEARCH: ", e);
  }
};

const ProgressBar = ({ start, done = false }) => {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now() - start), 1000);

    return () => clearInterval(interval);
  }, [start]);
  return (
    <>
      <Text>{time}</Text>
      <Progress
        mt="20px"
        hasStripe
        value={done ? 100 : (time / 1000 / 30) * 100}
      />
    </>
  );
};

const PromptRunner = ({ i, prompt, setCount }) => {
  console.log(i, prompt, setCount);
  const start = Date.now();
  const [result, setResult] = React.useState("");
  React.useEffect(() => {
    const go = async () => {
      try {
        const res = await runPrompt(prompt);
        setResult(res);
      } catch (e) {
        console.log("DIDNT WORK: ", e);
      }
    };
    go();
  }, [prompt]);

  return (
    <>
      <Text fontWeight="800">Prompt #{i + 1} Answers</Text>
      <Stack>
        <Text>{result}</Text>
        <ProgressBar start={start} done={!isEmpty(result)} />
      </Stack>
    </>
  );
};

const RequestManager = ({
  prompts = ["What is the capital of Ontario?", "What is the meaning of life?"],
}) => {
  return (
    <Wrap>
      <Box
        m="10px"
        maxW={"400px"}
        w={"95%"}
        height={"400px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>Active Requests</Heading>
        {prompts.map((p, i) => (
          <PromptRunner i={i} prompt={p} />
        ))}

        <Flex justify="flex-end">
          <Button
            onClick={() => {}}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Run
          </Button>
        </Flex>
      </Box>
    </Wrap>
  );
};

export default RequestManager;
