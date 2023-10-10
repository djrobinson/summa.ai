import React from "react";
import {
  createReport,
  createPhase,
  deleteReport,
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
  Stack,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";

const FETCH_REPORTS = gql`
  query getReport($id: String!) {
    Get {
      Report(where: { operator: Equal, path: ["id"], valueString: $id }) {
        _additional {
          id
        }
        text
        title
      }
    }
  }
`;

const Sentence = ({ sentence }) => {
    const [isUnderlined, setIsUnderlined] = React.useState(false);
    return <Text as="span" style={{ cursor: 'pointer', color: isUnderlined ? 'teal' : 'black'}} onMouseEnter={() => {setIsUnderlined(true)}} onMouseOut={() => setIsUnderlined(false)}>{sentence}</Text>

}

const Report = () => {
    const { id } = useParams();
  const { data, error, loading } = useQuery(FETCH_REPORTS, {
    variables: { id },
  });
  console.log("reports: ", data, error, loading);
  const [newReportTitle, setNewReportTitle] = React.useState("");
  const report = !isEmpty(data) ? data.Get.Report[0] : {};
  const sentences = report.text ? report.text.split("\n\n") : [];
    return (
        <Flex>
    <Box
        m="10px"
        w={"800px"}
        height={"800px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        >
        <Heading>Reports</Heading>
        <Text>{sentences.map(s => <Sentence sentence={s} />)}</Text>
      </Box>
      <Box
        m="10px"
        w={"800px"}
        height={"800px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        >
        <Heading>Analysis</Heading>

      </Box>
      </Flex>
    );


};

export default Report;
