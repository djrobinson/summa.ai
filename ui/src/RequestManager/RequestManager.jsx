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
  Input,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { rateLimitState, requestState, requestsState } from "../recoil/atoms";
import PromptControls from "./PromptControls";



const RequestManager = () => {
  console.log('RequestManager')
  const [requests, setRequests] = useRecoilState(requestsState);
  const [rateLimit, setRateLimit] = useRecoilState(rateLimitState)
  const [runAll, setRunAll] = React.useState(false);
  return (
    <Stack>
      <Box
        // eslint-disable-next-line react-hooks/rules-of-hooks
        rounded={"md"}
        p={6}
      >
        <Input placeholder="Token Rate Limit (tokens/min)" value={rateLimit} onChange={(e)=> {setRateLimit(e.target.value)}}/>
        {requests.map((p, i) => (
          <PromptControls id={p.id} prompt={p.prompt} forceRunAll={runAll} />
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
    </Stack>
  );
};

export default RequestManager;
