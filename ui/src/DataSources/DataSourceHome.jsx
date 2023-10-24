import React from "react";

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
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { createObject } from "../utils/weaviateServices";
import ConfigureDataSource from "./ConfigureDataSource";
import { useNavigate } from "react-router-dom";

const FETCH_DATA_SOURCE = gql`
  {
    Get {
      DataSource {
        _additional {
          id
        }
        name
      }
    }
  }
`;

const DataSourcesHome = () => {
  const navigate = useNavigate()
  const { data, error, loading } = useQuery(FETCH_DATA_SOURCE);
  console.log("Data Sources: ", data, error, loading);
  const [newSourceTitle, setNewSourceTitle] = React.useState("");
  const workflows = !isEmpty(data) ? data.Get.DataSource : [];

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
        <Heading>+ New Data Source</Heading>
        <Text m="40px 0" p="5px">
          Add your data!
        </Text>
        <FormLabel size="xs">Data Source Name:</FormLabel>
        <Input
          value={newSourceTitle}
          onChange={(e) => setNewSourceTitle(e.target.value)}
        />
        <Flex justify="flex-end">
          <Button
            onClick={async () => {
              const ds = await createObject("DataSource", {
                name: newSourceTitle,
              });
              console.log("NEW DS: ", ds);
              navigate(`/data/${ds.id}`);
            }}
            colorScheme="teal"
            alignSelf="end"
            mt="40px"
          >
            Create
          </Button>
        </Flex>
      </Box>

      {workflows.map((w) => (
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
          <Heading>{w.name}</Heading>
          <Flex justify="flex-end">
            <Button onClick={() => {}} colorScheme="red" mt="40px" mr="10px">
              Delete
            </Button>
            <Button
              onClick={() => {
                navigate(`/data/${w._additional.id}`);
              }}
              colorScheme="teal"
              mt="40px"
            >
              {" "}
              Edit
            </Button>
            <Button onClick={() => {}} colorScheme="teal" mt="40px">
              Start Workflow
            </Button>
          </Flex>
        </Box>
      ))}
    </Wrap>
  );
};

export default DataSourcesHome;
