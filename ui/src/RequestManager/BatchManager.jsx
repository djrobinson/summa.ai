import React from "react";

import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import {
  allBatchStatuses,
  doneBatchesState,
  erroredBatchesState,
  pendingBatchesState,
  runningBatchesState,
} from "../recoil/batchState.js";
import BatchControls from "./BatchControls.jsx";

const BatchManager = () => {
  const all = useRecoilValue(allBatchStatuses);
  const dones = useRecoilValue(doneBatchesState);
  const pendings = useRecoilValue(pendingBatchesState);
  const runs = useRecoilValue(runningBatchesState);
  const errors = useRecoilValue(erroredBatchesState);
  console.log("ALL BATCHES: ", all);
  return (
    <Box rounded={"md"}>
      <Heading align="center" fontSize="20px" pb="20px">
        Active Batched Saves
      </Heading>
      <Tabs zIndex={100} align="center">
        <TabList>
          <Tab>All</Tab>
          {/* <Tab>Running</Tab>
          <Tab>Pending</Tab>
          <Tab>Done</Tab>
          <Tab>Error</Tab> */}
        </TabList>
        <TabPanels align="start" h={"full"}>
          <TabPanel h={"full"}>
            {all.map((p, i) => (
              <BatchControls id={p.id} />
            ))}
          </TabPanel>
          {/* <TabPanel h={"full"}>
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
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BatchManager;
