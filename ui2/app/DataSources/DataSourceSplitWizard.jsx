'use client';

import React from "react";

import { FaPlay, FaRegSave } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Icon,
  Stack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { split } from "sentence-splitter";
import { isEmpty } from "lodash";
import {
  batchCreate,
  createOneToMany,
  createRelationship,
} from "../utils/weaviateServices";

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
        </NumberInput>
        <FormLabel pl="5px">word chunks</FormLabel>
      </Flex>
      <RadioGroup pt="20px" onChange={(e) => setSplitChar(e)} value={splitChar}>
        <Stack direction="column">
          <Radio value="WORD">Word</Radio>
          <Radio value="CHARACTER">Character</Radio>
          <Radio value="NEW_LINE">New Line</Radio>
          <Radio value="DOUBLE_NEW_LINE">Double New Line</Radio>
        </Stack>
      </RadioGroup>
    </Stack>
  );
};

const createBatch = async (splitSections, dataSourceID) => {
  const intermediates = splitSections.map((s, i) => {
    return {
      text: s,
      order: i + 1
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
      "DataSource",
      "Intermediate",
      dataSourceID,
      intermediateIDs,
      "intermediates",
      "dataSource"
    );
  }
};


const SplitWizard = ({ inputText, dataSourceID }) => {
  const [splitSections, setSplitSections] = React.useState([]);
  const [sentenceCount, setSentenceCount] = React.useState(10);
  const [splitChar, setSplitChar] = React.useState(" ");
  const DOUBLE_NEW_LINE = "\n\n";
  const NEW_LINE = "\n";
  const CHARACTER = "";
  const WORD = " ";
  const runSplitSample = React.useCallback(() => {
    let char = '';
    if (splitChar === 'DOUBLE_NEW_LINE') {
      char = DOUBLE_NEW_LINE;
    } else if (splitChar === 'NEW_LINE') {
      char = NEW_LINE;
    } else if (splitChar === 'CHARACTER') {
      char = CHARACTER;
    } else if (splitChar === 'WORD') {
      char = WORD;
    }
    const splitText = inputText.split(char);
    const grouped = [];
    let currString = "";
    let currCount = 0;
    // console.log("Running htis", splitText);
    splitText.forEach((st) => {
      currCount++;
      currString += char + st;
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
    <Box
      m="10px"
      w={"500px"}
      height={"800px"}
      // eslint-disable-next-line react-hooks/rules-of-hooks
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
    >
      {/* <Stack>
        <Flex justify="space-between">
          <Heading
            p="20px"
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
          >
            Split Text
          </Heading>
          <Box>
            <Icon m="10px" as={FiRefreshCcw} w={6} h={6} />
            <Icon m="10px" as={FaRegSave} w={6} h={6} />
            <Icon m="10px" as={FaPlay} w={6} h={6} />
          </Box>
        </Flex>
      </Stack> */}
      <SplitStrategy
        setSplitChar={setSplitChar}
        splitChar={splitChar}
        setSentenceCount={setSentenceCount}
        setSplitSections={setSplitSections}
      />
      <Tabs align="center" h={"380px"}>
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
            createBatch(splitSections, dataSourceID);
          }}
        >
          Split Document
        </Button>
      </Flex>
    </Box>
  );
};

export default SplitWizard;
