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
  Badge,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
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

const PromptControls = ({ id }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("PROMPT")
  const [request, setRequest] = useRecoilState(requestState(id));
  return (
    <>
    {
      showModal && (
        <Modal isOpen={showModal} onClose={() => {setShowModal(false)}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prompt Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Text fontWeight="800" fontSize="12px">Prompt</Text>
          <Text>
            {request.prompt}
          </Text>
          <Text fontWeight="800" fontSize="12px">Context</Text>
          <Text>
            {request.context}
          </Text>
          <Text fontWeight="800" fontSize="12px">Response</Text>
          <Text>
            {request.result}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {setShowModal(false)}}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )
    }
    <Stack borderTop="solid 1px lightgray" pt="10px">
      <Flex justify="space-between" align="center">
        <Stack>
        <Text fontWeight="800">Request {request.id.split('-')[0]}</Text>
          <Box>
          <StatusIcon status={request.status} />
          </Box>
        </Stack>
        <Flex justify="flex-end">
          <Button size="xs" mr="10px" color="white" bg="red">Pause</Button>
          <Button size="xs" mr="10px">Restart</Button>
          <Button size="xs" color="white" bg="green" onClick={() => {setRequest(prevR => ({...prevR, status: 'RUNNING', start: getUnixNow()}))}}>Run </Button>
        </Flex>
      </Flex>
      <Box h="100px">
        <Box pos="relative" w="full" bg="blue">
          <Box pos="absolute" h="100px" w="full" overflowY="hidden">
          <Text fontWeight="800" fontSize="12px">Prompt</Text>
          <Text>
            {request.prompt}
          </Text>
          </Box>
          <Box pos="absolute" h="100px" w="full" style={{ 
            zIndex: 3,
            background: `linear-gradient(transparent 0%, white)` 
          }}>
            <Flex w="full" h="full" align="flex-end" justify="flex-end">
            <Button variant="outline"  w="120px" bg="teal" color="white" size="xs" onClick={() => setShowModal(true)}>Full Prompt</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box h="100px">
        <Box pos="relative" w="full" bg="blue">
        <Box pos="absolute" h="100px" w="full" overflowY="hidden">
          <Text fontWeight="800" fontSize="12px">Context</Text>
          <Text>
            {request.context}
          </Text>
          </Box>
          <Box pos="absolute" h="100px" w="full" style={{ 
            zIndex: 3,
            background: `linear-gradient(transparent 0%, white)` 
          }}>
            <Flex w="full" h="full" align="flex-end" justify="flex-end">
            <Button variant="outline"  w="120px" bg="teal" color="white" size="xs" onClick={() => setShowModal(true)}>Full Context</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
      {/* todo: this will be a switch btwn errors/res/loading */}
      <Box h="100px">
        <Box pos="relative" w="full">
          <Box pos="absolute" h="100px" w="full" overflowY="hidden">
          <Text fontWeight="800" fontSize="12px">Response</Text>
          <Text>
            {request.result}
            
          </Text>
          </Box>
          <Box pos="absolute" h="100px" w="full"  style={{ 
            zIndex: 3,
            background: `linear-gradient(transparent 0%, white)` 
          }}>
          <Flex w="full" h="full" align="flex-end" justify="flex-end">
            <Button variant="outline" w="120px" bg="teal" color="white" size="xs" onClick={() => setShowModal(true)}>Full Response</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
      {!isEmpty(request.start) && <ProgressBar start={request.start} done={!isEmpty(request.result)} />}
    </Stack>
    </>
  );
};

export default PromptControls