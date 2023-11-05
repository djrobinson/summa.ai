import React from "react";

import {
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useRecoilState } from "recoil";

import IntermediatesPreview from "../components/IntermediatesPreview";
import { batchState } from "../recoil/batchState";
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
      <Progress mt="20px" hasStripe value={done ? 100 : (time / 30) * 100} />
    </>
  );
};

const StatusIcon = ({ status }) => {
  if (status === "RUNNING")
    return <Badge colorScheme="blue">In Progress</Badge>;
  if (status === "DONE") return <Badge colorScheme="green">Done</Badge>;
  if (status === "ERROR") return <Badge colorScheme="blue">Error</Badge>;
  else return <Badge colorScheme="yellow">Pending</Badge>;
};

const BatchControls = ({ id }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("PROMPT");
  const [batch, setBatch] = useRecoilState(batchState(id));
  console.log("what is batch ", id, batch);
  return (
    <>
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Batch Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <IntermediatesPreview
                intermediates={!batch.intermediates ? [] : batch.intermediates}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Stack borderTop="solid 1px lightgray" pt="10px">
        <Flex justify="space-between" align="center">
          <Stack>
            <Text fontWeight="800">Batch {batch ? batch.id : null}</Text>
            <Box>
              <StatusIcon status={batch.status} />
            </Box>
          </Stack>
          <Flex justify="flex-end">
            <Button size="xs" mr="10px" color="white" bg="red">
              Delete
            </Button>
          </Flex>
        </Flex>
        {/* todo: this will be a switch btwn errors/res/loading */}
        <Box h="100px">
          <Box pos="relative" w="full">
            <Box pos="absolute" h="100px" w="full" overflowY="hidden">
              <Text fontWeight="800" fontSize="12px">
                Response
              </Text>
              <Text>
                {!batch.intermediates
                  ? "Processing..."
                  : batch.intermediates[0].text}
              </Text>
            </Box>
            <Box
              pos="absolute"
              h="100px"
              w="full"
              style={{
                zIndex: 3,
                background: `linear-gradient(transparent 0%, white)`,
              }}
            >
              <Flex w="full" h="full" align="flex-end" justify="flex-end">
                <Button
                  variant="outline"
                  w="120px"
                  bg="teal"
                  color="white"
                  size="xs"
                  onClick={() => setShowModal(true)}
                >
                  Full Response
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
        {!isEmpty(batch.start) && (
          <ProgressBar start={batch.start} done={!isEmpty(batch.result)} />
        )}
      </Stack>
    </>
  );
};

export default BatchControls;
