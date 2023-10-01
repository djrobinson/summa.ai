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
import { requestState } from "../recoil/atoms";
import { getUnixNow } from "../utils/timeUtils";

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

const PromptControls = ({ id, prompt, setCount, forceRunAll }) => {
  console.log(id, prompt, setCount);
  const [request, setRequest] = useRecoilState(requestState(id));
  return (
    <>
      <Text fontWeight="800">Prompt #{id} Answers</Text>
      <Stack>
        <Text>{request.id} {request.status}</Text>
        <Text>{request.result}</Text>
        <ProgressBar start={90} done={!isEmpty(request.result)} />
        <Button onClick={() => {setRequest(prevR => ({...prevR, status: 'RUNNING', start: getUnixNow()}))}}>Run </Button>
      </Stack>
    </>
  );
};

export default PromptControls