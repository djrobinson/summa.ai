import React from "react";

import { useQuery } from "@apollo/client";
import { Box, Button, Code, Flex, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import { updatePhase } from "../../utils/weaviateServices";
import { GET_INTERMEDIATES } from "./MultiPromptWizard";

const CombineWizard = ({ phase, phaseID, prevPhaseID }) => {
  const [joinchar, setjoinchar] = React.useState(phase.prompt || "\n\n");
  const { data, error, loading } = useQuery(GET_INTERMEDIATES, {
    variables: {
      id: prevPhaseID,
    },
  });
  console.log("Combine Wizard: ", prevPhaseID, data, error, loading);
  const intermediates =
    data && data.Get.Phase[0].intermediates
      ? data.Get.Phase[0].intermediates
      : [];
  const joinedText = intermediates.reduce((acc, int) => {
    if (acc === "") return int.text;
    const yo = joinchar.replaceAll("\\n", "\n");
    console.log("YO ", yo);
    return acc + yo + int.text;
  }, "");

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
    };
    go();
  }, []);

  return (
    <Box w="600px" h="800px" overflowY="scroll" overflowX="hidden">
      <FormLabel fontSize="xs">Join Character</FormLabel>
      <Input
        mb="20px"
        placeholder="Join Character"
        value={joinchar}
        onChange={(e) => setjoinchar(e.target.value)}
      />
      <Box h="600px" overflowY="scroll">
        <Code p="8px">{joinedText}</Code>
      </Box>
      {/* <Box h="370px" overflowY={"scroll"}>
            {data && data.Get.Phase[0].intermediates && (<IntermediatesPreview intermediates={intermediates} />)}
        </Box> */}
      <Flex justify="flex-end">
        <Button
          onClick={async () => {
            // TODO: ALWAYS UPLOAD TO S3, SET INPUTTEXT ON NEXT PAGE TO S3 URL
            // SHOULD IT ALSO ALWAYS CREATE INTS??? maybe just go with both every time
            updatePhase(phaseID, {
              type: phase.type,
              joinCharacter: joinchar,
            });
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
