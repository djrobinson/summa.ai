import React from "react";

import {
  Wrap,
  Flex,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Input,
  FormLabel,
} from "@chakra-ui/react";

const Home = () => {
  const [newWorkflowTitle, setNewWorkflowTitle] = React.useState("");

  return (
    <Wrap>
      <Box
        m="10px"
        maxW={"400px"}
        w={"95%"}
        height={"400px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>+ New Data Source</Heading>
        <Text mt="40px" p="5px">
          Add your data
        </Text>
        <FormLabel size="xs">Data Source Name:</FormLabel>
        <Input
          value={newWorkflowTitle}
          onChange={(e) => setNewWorkflowTitle(e.target.value)}
        />
        <Flex justify="flex-end">
          <Button
            onClick={() => {}}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Create
          </Button>
        </Flex>
      </Box>
      <Box
        m="10px"
        maxW={"400px"}
        w={"95%"}
        height={"400px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>+ New Workflow</Heading>
        <Text mt="40px" p="5px">
          Create a workflow
        </Text>
        <FormLabel size="xs">Workflow Name:</FormLabel>
        <Input
          value={newWorkflowTitle}
          onChange={(e) => setNewWorkflowTitle(e.target.value)}
        />
        <Flex justify="flex-end">
          <Button
            onClick={() => {}}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Create
          </Button>
        </Flex>
      </Box>
      <Box
        m="10px"
        maxW={"400px"}
        w={"95%"}
        height={"400px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>Tutorial</Heading>
        <Text mt="40px" p="5px">
          Get started!
        </Text>

        <Flex justify="flex-end">
          <Button
            onClick={() => {}}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Learn More
          </Button>
        </Flex>
      </Box>
    </Wrap>
  );
};

export default Home;
