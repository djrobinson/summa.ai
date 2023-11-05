import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { batchCreate, createOneToMany } from "../../utils/weaviateServices";

const SplitStrategy = ({ setSentenceCount, setSplitChar, splitChar }) => {
  return (
    <Stack p="20px">
      <Text
        color={"green.500"}
        textTransform={"uppercase"}
        fontWeight={800}
        fontSize={"sm"}
        letterSpacing={1.1}
      >
        Split your data into chunks
      </Text>
      <Flex>
        <FormLabel>Create groupings of</FormLabel>
        <NumberInput
          onChange={(val) => setSentenceCount(val)}
          defaultValue={10}
          min={1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormLabel pl="5px">word chunks</FormLabel>
      </Flex>
      <RadioGroup pt="20px" onChange={(e) => setSplitChar(e)} value={splitChar}>
        <Stack direction="column">
          <Radio value=" ">Space</Radio>
          <Radio value="">Character</Radio>
        </Stack>
      </RadioGroup>
    </Stack>
  );
};

// MOVE TO ATOMS.JS
const createBatch = async (splitSections, phaseID) => {
  const intermediates = splitSections.map((s, i) => {
    return {
      text: s,
      order: i + 1,
    };
  });
  const batches = [];
  for (let i = 0; i < intermediates.length; i += 100) {
    batches.push(intermediates.slice(i, i + 100));
  }

  console.log("INTERMEDIATES: ", intermediates);
  for (let i = 0; i < batches.length; i++) {
    const res = await batchCreate("Intermediate", batches[i]);
    console.log("RES: ", i, res);
    const intermediateIDs = res.map((r) => r.id);
    await createOneToMany(
      "Phase",
      "Intermediate",
      phaseID,
      intermediateIDs,
      "intermediates",
      "dataSource"
    );
  }
};

const SplitWizard = ({ prevPhaseID, phaseID, updatePhase }) => {
  const [inputText, setInputText] = React.useState("");
  const [splitSections, setSplitSections] = React.useState([]);
  const [sentenceCount, setSentenceCount] = React.useState(10);
  const [splitChar, setSplitChar] = React.useState(" ");
  React.useEffect(() => {
    const go = async () => {
      const res = await axios.post(
        "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/readfile",
        {
          identifier: prevPhaseID,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      // update the data source with the s3 url
      // set phase to Splitter
      console.log("INIT SPLITFILE READ", res.data);
      setInputText(res.data.data);
    };
    go();
  }, []);
  const runSplitSample = React.useCallback(() => {
    const splitText = inputText.split(splitChar);
    const grouped = [];
    let currString = "";
    let currCount = 0;
    // console.log("Running htis", splitText);
    splitText.forEach((st) => {
      currCount++;
      currString += splitChar + st;
      if (currCount >= sentenceCount) {
        grouped.push(currString);
        currString = "";
        currCount = 0;
      }
    });
    return grouped;
  }, [inputText, sentenceCount, splitChar]);
  React.useEffect(() => {
    console.log("RUNNING SPLIT");
    const split = runSplitSample();
    setSplitSections(split);
  }, [inputText, sentenceCount, splitChar, runSplitSample]);

  return (
    <Box w="600px">
      <SplitStrategy
        setSplitChar={setSplitChar}
        splitChar={splitChar}
        setSentenceCount={setSentenceCount}
        setSplitSections={setSplitSections}
      />
      <Tabs align="center" h={"60%"}>
        <TabList>
          <Tab>Split Preview</Tab>
          <Tab>Raw Results</Tab>
        </TabList>
        <TabPanels align="start" h={"full"}>
          <TabPanel h={"full"}>
            <Box mt="10px" p="10px" h={"100%"} overflowY="scroll">
              {splitSections.slice(0, 20).map((d, i) => {
                return (
                  <Box key={i}>
                    <Heading size="xs" mt={"20px"}>
                      Section #{i + 1}
                    </Heading>
                    <Text mt={"20px"}>{d}</Text>
                  </Box>
                );
              })}
            </Box>
          </TabPanel>
          <TabPanel h={"full"}>
            <Box
              bg={"gray.800"}
              mt="20px"
              p="20px"
              h={"100%"}
              overflowY="scroll"
            >
              <Text color={"lime"}>{inputText}</Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Flex>
        <Button
          mt={"60px"}
          colorScheme="teal"
          rounded={"full"}
          flex={"1 0 auto"}
          onClick={() => {
            // createBatch(splitSections, phaseID);
            // update Phase, wait til atoms.js to do more
          }}
        >
          Save Split Configurations
        </Button>
      </Flex>
    </Box>
  );
};

export default SplitWizard;
