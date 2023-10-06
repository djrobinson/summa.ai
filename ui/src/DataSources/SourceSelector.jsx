import React from "react";

import { useLazyQuery, gql, useQuery } from "@apollo/client";

import { FaPlay, FaRegSave } from "react-icons/fa";
import { FiFile, FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import {
  Icon,
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  InputGroup,
  InputLeftElement,
  Textarea,
  RadioGroup,
  Radio,
  Wrap,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";

const SourceSelector = ({ pasted, setDsID, setShowConfigure, setPasted }) => {
  const [mode, setMode] = React.useState(null);
  // do initial query for data source. if it exists, set mode to that
  const updateAndBack = async () => {
    const res = await axios.post(
      "https://f5k974500j.execute-api.us-west-2.amazonaws.com/dev/fileupload",
      {
        data: pasted,
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
    setShowConfigure(false);
    setDsID(null);
  };
  return (
    <Box
      m="10px"
      w={"500px"}
      height={"800px"}
      bg={"white"}
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
    >
      <Stack p="20px">
        <Text
          color={"green.500"}
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          Choose a data source type
        </Text>
        <RadioGroup
          onChange={(val) => {
            setMode(val);
          }}
          value={mode}
        >
          <Stack direction="column">
            <Radio value="weaviate">
              Connect to a running Weaviate instance
            </Radio>
            <Radio value="csv">Upload a CSV</Radio>
            <Radio value="pasted">Paste text</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      <Stack>
        {mode === "weaviate" && (
          <Stack>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Connect to a Weaviate Instance
            </Text>
            <Input
              type={"text"}
              placeholder={"http://localhost:8080"}
              color={"gray.800"}
              bg={"gray.100"}
              rounded={"full"}
              border={0}
              _focus={{
                bg: "gray.200",
                outline: "none",
              }}
            />
          </Stack>
        )}

        {mode === "csv" && (
          <Stack pt="20px">
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Upload a CSV
            </Text>
            <FormControl isInvalid={false} isRequired>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FiFile} />}
                />
                <input type="file" style={{ display: "none" }}></input>
                <Input
                  color={"gray.800"}
                  bg={"gray.100"}
                  rounded={"full"}
                  border={0}
                  placeholder={"Your file ..."}
                  // onClick={() => inputRef.current.click()}
                />
              </InputGroup>
            </FormControl>
          </Stack>
        )}
        {mode === "pasted" && (
          <Stack pt="20px">
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              Paste Text
            </Text>
            <Textarea
              color={"gray.800"}
              bg={"gray.100"}
              border={0}
              rounded="15px"
              height="400px"
              value={pasted}
              onChange={(e) => {
                setPasted(e.target.value);
              }}
              placeholder="heres text"
            />
          </Stack>
        )}
      </Stack>
      {!isEmpty(mode) && (
        <Flex>
          <Button
            mt={"20px"}
            colorScheme="teal"
            rounded={"full"}
            flex={"1 0 auto"}
            onClick={() => updateAndBack()}
          >
            Validate Data Source
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default SourceSelector;
