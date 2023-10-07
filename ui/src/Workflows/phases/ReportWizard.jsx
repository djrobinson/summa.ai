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
  useQuery,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { requestsState } from "../../recoil/atoms";
import { GET_INTERMEDIATES } from "./MultiPromptWizard";
import { isEmpty } from "lodash";

const ReportWizard = ({ phaseID, prevPhaseID }) => {
    const [summarizingPrompt, setSummarizingPrompt] = React.useState("");
    const [showManager, setShowManager] = React.useState(false);
    const [requests, setRequests] = useRecoilState(requestsState);
    const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
        variables: {
        id: prevPhaseID,
        },
    });
    console.log('WHAT IS REPORT INTERMEDIATES: ', data, error, loading)
    const context = !isEmpty(data) ? data.Get.Phase[0].intermediates[0].text : [];
    console.log('WHAT CONTEXT: ', context)
    // TODO: NEED TO BUILD THE SINGLE REPORT PROMPT REQUEST, PASS IN SOME INFO
    // THAT INDICATES IT'S A REPORT. atoms.js WILL HANDLE ROUTING TO THE RIGHT
    // URL. LAMBDA HANDLES CREATION.
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
            setRequests([...requests, {
                id: 'REPORT-1',
                type: 'REPORT',
                prompt: summarizingPrompt,
                context: context
            }])
            setShowManager(true)
          }}
        >
          Generate Report
        </Button>
      </Flex>
    </Box>
  );
};

export default ReportWizard;
