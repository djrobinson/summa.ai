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
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

const AccountManager = ({
    presetApiKey
}) => {

    const [apiKey, setApiKey] = React.useState(presetApiKey)
    const navigate = useNavigate();
  return (
    <Wrap>
      <Box
        m="10px"
        maxW={"400px"}
        w={"95%"}
        height={"400px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
      >
        <Heading>Manage API Keys</Heading>

        <Input placeholder="API Key"  value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <Flex justify="flex-end">
          <Button
            onClick={async () => {
                localStorage.setItem('OPENAI_API_KEY', apiKey)
                navigate("/")
            }}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Save
          </Button>
        </Flex>
      </Box>
    </Wrap>
  );
};

export default AccountManager;
