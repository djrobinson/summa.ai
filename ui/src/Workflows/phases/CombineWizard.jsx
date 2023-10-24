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
  getToken,
  FormLabel,

} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { GET_INTERMEDIATES } from "./MultiPromptWizard";
import IntermediatesPreview from "../../components/IntermediatesPreview";
import { useQuery } from "@apollo/client";
import axios from "axios";
import { getTokenCount, isValidLength } from "../../utils/tokenHelpers";
import { createObject, createRelationship, updatePhase } from "../../utils/weaviateServices";
import { GrConsole } from "react-icons/gr";


const CombineWizard = ({
    phase,
    phaseID,
    prevPhaseID
}) => {
    
    const [joinchar, setjoinchar] = React.useState(phase.prompt || '\n\n')
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

    // TODO: IF IT'S SMALL, JUST SAVE THE INTERMEDIATE
    const updateAndBack = async () => {
        console.log('JOINEDTEXT ', joinedText)
        const isSmall = isValidLength(joinedText)
        const size = getTokenCount(joinedText)
        console.log("IS IT SMALL?", size)
        if (isSmall) {
            const objRes = await createObject("Intermediate", {
                text: joinedText,
                order: 0
            });
            await createRelationship(
                "Phase",
                phaseID,
                "intermediates",
                "Intermediate",
                objRes.id,
                "phase"
            );

            console.log("CREATED INTERMEDIATE FOR SMALL ONE!", objRes)
        } else {
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
            console.log("big res", res);
        }
        // update the data source with the s3 url
        // set phase to Splitter
        };
    

    
  return (
    <Box w="600px" h="800px" overflowY="scroll" overflowX="hidden">

        <FormLabel fontSize="xs">Join Character</FormLabel>
        <Input mb="20px" placeholder="Join Character"  value={joinchar} onChange={(e) => setjoinchar(e.target.value)} />
        <Box h="600px" overflowY='scroll'>
        <Code p="8px">{joinedText}</Code>
        </Box>
        {/* <Box h="370px" overflowY={"scroll"}>
            {data && data.Get.Phase[0].intermediates && (<IntermediatesPreview intermediates={intermediates} />)}
        </Box> */}
        <Flex justify="flex-end">
          <Button
            onClick={async () => {
            // TODO: ALWAYS UPLOAD TO S3, SET INPUTTEXT ON NEXT PAGE TO S3 URL
            updatePhase(phaseID, {
                type: phase.type,
                prompt: joinchar
            })
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
