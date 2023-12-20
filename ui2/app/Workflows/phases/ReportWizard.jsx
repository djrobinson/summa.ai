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
  CardFooter
} from "@chakra-ui/react";
import PromptControls from "../../RequestManager/PromptControls";
import { useRecoilState } from "recoil";
import { doneRequestsState, requestsState } from "../../recoil/atoms";
import { GET_INTERMEDIATES } from "./MultiPromptWizard";
import { isEmpty } from "lodash";
import { useQuery } from "@apollo/client";
import { updatePhase } from "../../utils/weaviateServices";
import { useNavigate } from "react-router-dom";

const ReportWizard = ({ phase, workflowID, phaseID, prevPhaseID }) => {
    const navigate = useNavigate();
    const [summarizingPrompt, setSummarizingPrompt] = React.useState(phase.prompt || '');
    const [showManager, setShowManager] = React.useState(false);
    const [reportType, setReportType] = React.useState('ARTICLE')
    const [reportTitle, setReportTitle] = React.useState('')
    const [requests, setRequests] = useRecoilState(requestsState);
    const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
        variables: {
        id: prevPhaseID,
        },
    });
    const context = !isEmpty(data) && !isEmpty(data.Get.Phase) && !isEmpty(data.Get.Phase[0].intermediates) ? summarizingPrompt + ' ' + data.Get.Phase[0].intermediates[0].text : [];
    const [doneRequests] = useRecoilState(doneRequestsState)
    const reportRequest = doneRequests.filter((request) => request.id === 'REPORT-3')
    const reportID = reportRequest.length > 0 ? reportRequest[0].reportID : null
  return (
    <Box w="600px">
        {!showManager && (
        <><Text mb="20px">What type of report would you like to generate?</Text>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            <Card border={reportType==='ARTICLE' ? 'solid 3px teal' : null}>
                <CardHeader>
                <Heading size='md'>Article</Heading>
                </CardHeader>
                <CardBody>
                <Text>Write a summarization of upstream data in longform article format.</Text>
                </CardBody>
                <CardFooter>
                <Button onClick={() => setReportType('ARTICLE')}>Select</Button>
                </CardFooter>
            </Card>
            <Card border={reportType==='BULLETS' ? 'solid 3px teal' : null}>
                <CardHeader>
                <Heading size='md'>Bullet Points</Heading>
                </CardHeader>
                <CardBody>
                <Text>Iterate over a specified number of upstream datapoints to provide a bullet pointed summary of each.</Text>
                </CardBody>
                <CardFooter>
                <Button onClick={() => setReportType('BULLETS')}>Select</Button>
                </CardFooter>
            </Card>
            <Card border={reportType==='COMPARE' ? 'solid 3px teal' : null}>
                <CardHeader>
                <Heading size='md'>Compare & Contrast</Heading>
                </CardHeader>
                <CardBody>
                <Text>View a summary of all your customers over the last month.</Text>
                </CardBody>
                <CardFooter>
                <Button onClick={() => setReportType('COMPARE')}>Select</Button>
                </CardFooter>
            </Card>
        </SimpleGrid>
        </>)}
        <Text>Report Title:</Text>
        <Input onChange={(e) => setReportTitle(e.target.value)} value={reportTitle} />
        <Text mt="20px">Article Generation Prompt:</Text>
        <Textarea
            mt="20px"
            value={summarizingPrompt}
            onChange={(e) => setSummarizingPrompt(e.target.value)}
        />
        {
            showManager && (
                <PromptControls prompt={context} id={'REPORT-3'} />
            )
        }
        <Flex>
        {

            !reportID ? (<Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={async () => {
            const updatedPhase = { type: phase.type, prompt: summarizingPrompt }
            console.log("updatedPhase ", updatedPhase)
            await updatePhase(phase._additional.id, updatedPhase)
            setRequests([...requests, {
                id: 'REPORT-3',
                type: 'REPORT',
                prompt: summarizingPrompt,
                context: context,
                reportTitle,
                phaseID,
                workflowID

            }])
            setShowManager(true)

          }}
        >
          Generate Report
        </Button>) : (
        <Button
          mt={"20px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={() => {
            navigate(`/reports/${reportID}`)
          }}
        >
          GO TO REPORT: {reportID}
        </Button>)
        }
      </Flex>
    </Box>
  );
};

export default ReportWizard;
