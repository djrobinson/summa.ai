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
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { apiKeyState, requestsState } from "../recoil/atoms";

const FETCH_REPORTS = gql`
  query getReport($id: String!) {
    Get {
      Report(where: { operator: Equal, path: ["id"], valueString: $id }) {
        _additional {
          id
        }
        text
        title
        workflow {
          ... on Workflow {
            _additional {
              id
            }
            phases {
              ... on Phase {
                _additional {
                  id
                }
                type
              }
            }
          }
        }
      }
    }
  }
`;

// todo: filter to only datasource intermediates
const FETCH_RELATED = gql`
  query getRelated($concept: String!, $lim: Int!) {
    Get {
      Intermediate(
        where: {
          path: ["phase", "Phase", "id"],
          operator: Equal,
          valueText: "hey"
        }
        nearText: {
          concepts: [$concept]
        }
        limit: $lim
      ) {
        _additional {
          id
        }
        text
        phase {
          ... on Phase {
            _additional {
              id
            }
        }
      }
    }
  }
  }
`;


const Sentence = ({ sentence, setAnalyzeSentence }) => {
    const [isUnderlined, setIsUnderlined] = React.useState(false);
    return <Text as="span" style={{ cursor: 'pointer', color: isUnderlined ? 'teal' : 'black'}} onMouseEnter={() => {setIsUnderlined(true)}} onMouseOut={() => setIsUnderlined(false)} onClick={() => setAnalyzeSentence(sentence)}>{sentence}</Text>
}

const enhance = async (analyzeSentence, relatedData, setRequests) => {
  const newRequests = relatedData.map((r) => {
    return {
      id: r._additional.id,
      prompt: "Find the 2-3 statements from the context that best support the following summary sentence. Return them verbatim and order them by relevance (high to low): \nSUMMARY SENTENCE: " + analyzeSentence,
      context: "\nCONTEXT: " + r.text,
    };
  })
  setRequests(rs => [...rs, ...newRequests])
}

const Report = () => {
    const { id } = useParams();
  const { data, error, loading } = useQuery(FETCH_REPORTS, {
    variables: { id },
  });
  console.log("REPORT : ", data, error)
  // const dataSourcePhaseID = data && data.Get.Report[0].phases[0].workflow[0].phases.filter(p => p.type === "DATA_SOURCE")[0]._additional.id
  // console.log("YOLO: ", dataSourcePhaseID)
  const apiKey = useRecoilValue(apiKeyState)
  const [requests, setRequests] = useRecoilState(requestsState);
  
  console.log("reports: ", data, error, loading);
  const [analyzeSentence, setAnalyzeSentence] = React.useState("");
  const [fetchRelated, { data: relatedData, error: relatedError, loading: relatedLoading }] = useLazyQuery(FETCH_RELATED, {
    variables: { concept: analyzeSentence, lim: "5" },
    context: {
      headers: {
        "X-Openai-Api-Key": apiKey
      }
    },
  });
  
  const report = !isEmpty(data) ? data.Get.Report[0] : {};
  const sentences = report.text ? report.text.split("\n\n") : [];
    return (
        <Box >
    <Box
        m="10px"
        w={"900px"}
        height={"880px"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"md"}
        p={120}
        align="justify"
        justify="center"
        >
        <Heading>Report</Heading>
        <br />
        <Text>{sentences.map(s => <Sentence setAnalyzeSentence={(val) => {
          setAnalyzeSentence(val)
          fetchRelated()
        }} sentence={s} />)}</Text>
      </Box>
      <Box
        pos="absolute"
        right="0px"
        top="0px"
        w={"500px"}
        height={"100%"}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={"white"}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow="scroll"
        p={6} trapFocus={false} size="md" placement={'right'} onClose={()=> {}} isOpen={true}>
            <Text>{analyzeSentence}</Text>
            <Button onClick={() => enhance(analyzeSentence, relatedData.Get.Intermediate, setRequests)}>Enhance Supporting Texts w/ AI</Button>
            <Text fontWeight="800">Supporting Texts</Text>
            {
              relatedData && relatedData.Get.Intermediate.map((r) => <Text mt="30px">{r.text}</Text>)
            }
      </Box>
      </Box>
    );


};

export default Report;
