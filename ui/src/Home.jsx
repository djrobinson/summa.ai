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
        w={"48%"}
        height={"420px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>Setup Your Account</Heading>
        <Text mt="40px" p="5px">
          Get started!
        </Text>

        <Flex >
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
      <Box
        m="10px"
        w={"48%"}
        height={"420px"}
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
        <Flex >
        <Input
          value={newWorkflowTitle}
          onChange={(e) => setNewWorkflowTitle(e.target.value)}
        />
        
          <Button
            onClick={() => {}}
            colorScheme="teal"
            alignSelf="end"
            ml="10px"
          >
            Create
          </Button>
        </Flex>
      </Box>
      <Box
        m="10px"
        w={"48%"}
        height={"420px"}
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
        <Flex >
            <Input
              value={newWorkflowTitle}
              onChange={(e) => setNewWorkflowTitle(e.target.value)}
            />
            
          <Button
            onClick={() => {}}
            colorScheme="teal"

            ml="10px"
          >
            Create
          </Button>
        </Flex>
      </Box>
      <Box
        m="10px"
        w={"48%"}
        height={"420px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>+ New Report</Heading>
        <Text mt="40px" p="5px">
          Create a report
        </Text>
        <FormLabel size="xs">Report Name:</FormLabel>
        <Flex >
        <Input
          value={newWorkflowTitle}
          onChange={(e) => setNewWorkflowTitle(e.target.value)}
        />
          <Button
            ml="10px"
            onClick={() => {}}
            colorScheme="teal"
          >
            Create
          </Button>
        </Flex>
      </Box>
      
    </Wrap>
  );
};

export default Home;
