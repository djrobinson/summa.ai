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
  Input,
  Code,

} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { GET_INTERMEDIATES } from "./MultiPromptWizard";
import IntermediatesPreview from "../../components/IntermediatesPreview";
import { useQuery } from "@apollo/client";
import axios from "axios";


const CombineWizard = ({
    phaseID,
    prevPhaseID
}) => {
    
    const [joinchar, setjoinchar] = React.useState('\n\n')
    const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
        variables: {
            id: prevPhaseID,
        },
        });
    console.log("Combine Wizard: ", prevPhaseID, data, error, loading);
    const intermediates = data && data.Get.Phase[0].intermediates ? data.Get.Phase[0].intermediates : []
    const joinedText = intermediates.reduce((acc, int)=> {
        if (acc === '') return int.text
        const yo = joinchar.replaceAll('\\n', '\n')
        console.log("YO ", yo)
        return acc + yo + int.text
        }, '')

    React.useEffect(() => {
        const go = async () => {
            const res = await axios.post(
                "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/readfile",
                {
                    identifier: phaseID,
                },
                {
                headers: {
                    "Content-Type": "text/plain",
                },
                }
            );
            // update the data source with the s3 url
            // set phase to Splitter
            console.log("INIT READFILE", res);
        }
        go()
    },[])

    const updateAndBack = async () => {
        console.log('JOINEDTEXT ', joinedText)
        const res = await axios.post(
            "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/fileupload",
            {
                identifier: phaseID,
                data: joinedText,
            },
            {
            headers: {
                "Content-Type": "text/plain",
            },
            }
        );
        // update the data source with the s3 url
        // set phase to Splitter
        console.log("res", res);
        };
    

    
  return (
    <Box w="600px">

        <Heading>Combine Texts</Heading>
    
        <Input placeholder="Join Character"  value={joinchar} onChange={(e) => setjoinchar(e.target.value)} />
        <Code>{joinedText}</Code>
        <Box h="370px" overflowY={"scroll"}>
        {data && data.Get.Phase[0].intermediates && (
        <IntermediatesPreview intermediates={intermediates} />)}
        </Box>
        <Code style={{ whiteSpace: 'pre-line'}}></Code>
        <Flex justify="flex-end">
          <Button
            onClick={() => {
            // TODO: ALWAYS UPLOAD TO S3, SET INPUTTEXT ON NEXT PAGE TO S3 URL
            updateAndBack()
            }}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Save
          </Button>
        </Flex>

    </Box>
  );
};

export default CombineWizard;
