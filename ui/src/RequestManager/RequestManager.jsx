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

const PromptRunner = ({ id, prompt, setCount, forceRunAll }) => {
  console.log(id, prompt, setCount);
  const [request, setRequest] = useRecoilState(requestState(id));
  return (
    <>
      <Text fontWeight="800">Prompt #{id} Answers</Text>
      <Stack>
        <Text>{request.id} {request.status}</Text>
        <Text>{request.result}</Text>
        {/* <ProgressBar start={start} done={!isEmpty(result)} /> */}
        <Button onClick={() => {setRequest(prevR => ({...prevR, status: 'RUNNING'}))}}>Run </Button>
      </Stack>
    </>
  );
};


const RequestManager = () => {
  console.log('RequestManager')
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
          <PromptRunner id={p.id} prompt={p.prompt} forceRunAll={runAll} />
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
