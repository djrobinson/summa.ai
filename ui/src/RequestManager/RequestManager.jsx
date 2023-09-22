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
import { isEmpty } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { requestState, requestsState } from "../recoil/atoms";

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

const PromptRunner = ({ i, prompt, setCount, forceRunAll }) => {
  console.log(i, prompt, setCount);
  const [request, setRequest] = useRecoilState(requestState(i, { id: i, type: 'PROMPT', data: prompt, status: 'PENDING'}));
  const start = Date.now();
  React.useEffect(() => {
    // TODO: CAN THIS BE MEMOIZED. NEED A GUARANTEE TO RUN ONCE
    if (request.status === 'RUNNING') {
      const go = async () => {
        try {
          const res = await runPrompt(prompt.prompt);
          console.log("RES: ", res);
          setResult(res);
          setRequest(prevR => ({...prevR, status: 'DONE', result: res}));
        } catch (e) {
          console.log("DIDNT WORK: ", e);
        }
      };
      go();
    }},[prompt, request, setRequest])
    React.useEffect(() => {
      if (forceRunAll && request.status !== 'DONE') {
        setRequest(prevR => ({...prevR, status: 'RUNNING'}));
      }
    },[forceRunAll])
  const [result, setResult] = React.useState("");
  return (
    <>
      <Text fontWeight="800">Prompt #{i + 1} Answers</Text>
      <Stack>
        <Text>{request.id} {request.status}</Text>
        <Text>{result}</Text>
        {/* <ProgressBar start={start} done={!isEmpty(result)} /> */}
        <Button onClick={() => {setRequest(prevR => ({...prevR, status: 'RUNNING'}))}}>Run </Button>
      </Stack>
    </>
  );
};

// const go = async () => {
//   try {
//     setRequestsInProgress({
//       id: i,
//       start: Date.now(),
//       prompt: prompt,
//       result: "",
//       done: false
//     })
//     const res = await runPrompt(prompt);
//     setResult(res);
//   } catch (e) {
//     console.log("DIDNT WORK: ", e);
//   }
// };


const RequestManager = () => {
  const [requests, setRequests] = useRecoilState(requestsState);
  const [runAll, setRunAll] = React.useState(false);
  return (
    <Wrap>
      <Box
        // eslint-disable-next-line react-hooks/rules-of-hooks
        rounded={"md"}
        p={6}
      >
        {requests.map((p, i) => (
          <PromptRunner i={i} prompt={p} forceRunAll={runAll} />
        ))}
        <Flex justify="flex-end">
          <Button
            onClick={() => { setRunAll(true)}}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Run All
          </Button>
        </Flex>
      </Box>
    </Wrap>
  );
};

export default RequestManager;
