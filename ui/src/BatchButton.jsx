// Super important component!
// Must be visible at all times, and shouldn't have parent who regularly updates
// Coordinates all of the queued requests.
// Done in lieu of a backend queuing system. Not even sure that's desirable at this point.
import React from "react";

import { Badge, IconButton, Stack, Text } from "@chakra-ui/react";

import { BsDatabaseCheck } from "react-icons/bs";

import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import {
  batchState,
  doneBatchesState,
  erroredBatchesState,
  pendingBatchesState,
  runningBatchesState,
  showBatchManagerState,
} from "./recoil/batchState.js";
import { getUnixNow } from "./utils/timeUtils.js";

const BatchButton = () => {
  const [showBatches, setShowBatches] = useRecoilState(showBatchManagerState);
  const dones = useRecoilValue(doneBatchesState);
  const pendings = useRecoilValue(pendingBatchesState);
  const runs = useRecoilValue(runningBatchesState);
  const errors = useRecoilValue(erroredBatchesState);

  const runPending = useRecoilCallback(({ set }) => async (rid) => {
    console.log("running ", rid);
    set(batchState(rid), (oldR) => ({
      ...oldR,
      status: "RUNNING",
      start: getUnixNow(),
    }));
  });
  React.useEffect(() => {
    console.log("POLLING PENDINGS: ", pendings);
    pendings.forEach((p) => {
      runPending(p.id);
    });
  }, [pendings, runPending]);

  return (
    <>
      <Stack align="center" mr="20px">
        <IconButton
          variant="ghost"
          fontSize="30px"
          icon={<BsDatabaseCheck />}
          onClick={() => {
            setShowBatches(!showBatches);
          }}
        />
        <Stack
          align="center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowBatches(!showBatches);
          }}
        >
          <Text mt="-3" fontSize="12px">
            Saved
          </Text>
          <Text mt="-3" fontSize="12px">
            Records
          </Text>
        </Stack>
      </Stack>

      <Stack>
        <Badge colorScheme="blue">{runs.length} In Progress</Badge>
        <Badge colorScheme="green">{dones.length} Complete</Badge>
        <Badge colorScheme="red">{errors.length} Errors</Badge>
      </Stack>
    </>
  );
};

export default BatchButton;
