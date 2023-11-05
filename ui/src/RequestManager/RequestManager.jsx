import React from "react";

import {
  Box,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  allRequestStatuses,
  doneRequestsState,
  erroredRequestsState,
  pendingRequestsState,
  rateLimitState,
  runningRequestsState,
} from "../recoil/atoms";
import PromptControls from "./PromptControls";

const RequestManager = () => {
  const [rateLimit, setRateLimit] = useRecoilState(rateLimitState);
  const all = useRecoilValue(allRequestStatuses);
  const dones = useRecoilValue(doneRequestsState);
  const pendings = useRecoilValue(pendingRequestsState);
  const runs = useRecoilValue(runningRequestsState);
  const errors = useRecoilValue(erroredRequestsState);
  return (
    <Box
      // eslint-disable-next-line react-hooks/rules-of-hooks
      rounded={"md"}
    >
      <Heading align="center" fontSize="20px" pb="20px">
        Active Requests
      </Heading>
      <FormLabel fontSize="12px" fontWeight="800">
        Rate Limit
      </FormLabel>
      <Input
        placeholder="Token Rate Limit (tokens/min)"
        value={rateLimit}
        onChange={(e) => {
          setRateLimit(e.target.value);
        }}
      />
      <Tabs align="center">
        <TabList>
          <Tab>All</Tab>
          <Tab>Running</Tab>
          <Tab>Pending</Tab>
          <Tab>Done</Tab>
          <Tab>Error</Tab>
        </TabList>
        <TabPanels align="start" h={"full"}>
          <TabPanel h={"full"}>
            {all.map((p, i) => (
              <PromptControls id={p.id} prompt={p.prompt} />
            ))}
          </TabPanel>
          <TabPanel h={"full"}>
            {runs.map((p, i) => (
              <PromptControls id={p.id} prompt={p.prompt} />
            ))}
          </TabPanel>
          <TabPanel h={"full"}>
            {pendings.map((p, i) => (
              <PromptControls id={p.id} prompt={p.prompt} />
            ))}
          </TabPanel>
          <TabPanel h={"full"}>
            {dones.map((p, i) => (
              <PromptControls id={p.id} prompt={p.prompt} />
            ))}
          </TabPanel>
          <TabPanel h={"full"}>
            {errors.map((p, i) => (
              <PromptControls id={p.id} prompt={p.prompt} />
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default RequestManager;
