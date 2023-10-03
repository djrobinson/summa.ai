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
  Badge
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { requestState } from "../recoil/atoms";
import { getUnixNow } from "../utils/timeUtils";

const ProgressBar = ({ start, done = false }) => {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setTime(getUnixNow() - start), 1000);
    return () => clearInterval(interval);
  }, [start]);
  return (
    <>
      <Text>{time}s / 30s</Text>
      <Progress
        mt="20px"
        hasStripe
        value={done ? 100 : (time / 30) * 100}
      />
    </>
  );
};

const StatusIcon = ({status}) => {
  if (status === 'RUNNING') return <Badge colorScheme='blue'>In Progress</Badge>
  if (status === 'DONE') return <Badge colorScheme='green'>Done</Badge>
  if (status === 'ERROR') return <Badge colorScheme='blue'>Error</Badge>
  else return <Badge colorScheme='yellow'>Pending</Badge>
}

const PromptControls = ({ id, prompt, setCount }) => {
  console.log(id, prompt, setCount);
  const [request, setRequest] = useRecoilState(requestState(id));
  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Text fontWeight="800">Request #{request.id}</Text>
        <StatusIcon status={request.status} />
      </Flex>
      <Text>
        {request.data}
      </Text>
      <Text>{request.result}</Text>
      {!isEmpty(request.start) && <ProgressBar start={request.start} done={!isEmpty(request.result)} />}
      <Flex pl="150px" justify="space-around">
        <Button size="xs" color="white" bg="red">Pause</Button>
        <Button size="xs">Restart</Button>
        <Button size="xs" color="white" bg="green" onClick={() => {setRequest(prevR => ({...prevR, status: 'RUNNING', start: getUnixNow()}))}}>Run </Button>
      </Flex>
    </Stack>
  );
};

export default PromptControls