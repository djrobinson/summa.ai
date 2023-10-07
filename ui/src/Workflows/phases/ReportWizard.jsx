import React from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
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
  Center,
  Select,
  Textarea,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { requestsState } from "../../recoil/atoms";

const ReportWizard = ({ phaseID }) => {
    const [summarizingPrompt, setSummarizingPrompt] = React.useState("");
    const [showManager, setShowManager] = React.useState(false);
    const [requests, setRequests] = useRecoilState(requestsState);
  return (
    <Box w="600px">
      <Text fontSize="20px" fontWeight="800">Report Wizard</Text>
        <Text>What type of report would you like to generate?</Text>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            <Card>
                <CardHeader>
                <Heading size='md'>Article</Heading>
                </CardHeader>
                <CardBody>
                <Text>Write a summarization of upstream data in longform article format.</Text>
                </CardBody>
                <CardFooter>
                <Button>Select</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                <Heading size='md'>Bullet Points</Heading>
                </CardHeader>
                <CardBody>
                <Text>Iterate over a specified number of upstream datapoints to provide a bullet pointed summary of each.</Text>
                </CardBody>
                <CardFooter>
                <Button>Select</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                <Heading size='md'>Compare & Contrast</Heading>
                </CardHeader>
                <CardBody>
                <Text>View a summary of all your customers over the last month.</Text>
                </CardBody>
                <CardFooter>
                <Button>Select</Button>
                </CardFooter>
            </Card>
        </SimpleGrid>
        <Text mt="20px">Article Generation Prompt:</Text>
        <Textarea
            mt="20px"
            value={summarizingPrompt}
            onChange={(e) => setSummarizingPrompt(e.target.value)}
        />
        <Flex>
        <Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={() => {
            setRequests([...requests])
            showManager(true)
          }}
        >
          Generate Report
        </Button>
      </Flex>
    </Box>
  );
};

export default ReportWizard;
