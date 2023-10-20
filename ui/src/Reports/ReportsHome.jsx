import React from "react";
import {
  createObject,
} from "../utils/weaviateServices";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import axios from "axios";

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
import { useLazyQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";
import { Link, useNavigate } from "react-router-dom";

const FETCH_REPORTS = gql`
  {
    Get {
      Report {
        _additional {
          id
        }
        text
        title
      }
    }
  }
`;

const ReportsHome = () => {
  const navigate = useNavigate();
  const [fetchReports, { data, error, loading }] =
    useLazyQuery(FETCH_REPORTS);
  console.log("reports: ", data, error, loading);
  const [newReportTitle, setNewReportTitle] = React.useState("");
  const workflows = !isEmpty(data) ? data.Get.Report : [];
  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);
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
          <Heading>+ New Report</Heading>
          <Text mt="40px" p="5px">
            Reports allow you to run complex reasoning tasks against various
            data sources using Open AI's GPT-4 model.
          </Text>
          <FormLabel size="xs">Report Name:</FormLabel>
          <Input
            value={newReportTitle}
            onChange={(e) => setNewReportTitle(e.target.value)}
          />
          <Flex justify="flex-end">
            <Button
              onClick={async () => {
                const wf = await createObject("Report", {
                  name: newReportTitle,
                });
                console.log("NEW WF: ", `/reports/${wf.id}`);

                navigate(`/reports/${wf.id}`);
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
            <Heading>{w.title}</Heading>
            <Flex justify="flex-end">
              <Button
                onClick={() => {
                }}
                colorScheme="red"
                mt="40px"
                mr="10px"
              >
                Delete
              </Button>


              <Link to={`${w._additional.id}`} >
                View
              </Link>

            </Flex>
          </Box>
        ))}
      </Wrap>
    );


};

export default ReportsHome;
