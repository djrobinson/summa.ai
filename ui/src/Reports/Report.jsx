import React from "react";
import {
  createReport,
  createPhase,
  deleteReport,
  createObject,
} from "../utils/weaviateServices";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import {TokenAnnotator, TextAnnotator} from 'react-text-annotate'
import axios from "axios";
import md5 from "md5";


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
import { apiKeyState, enhanceRequestResultsState, enhanceRequestsState, requestState, requestsState } from "../recoil/atoms";

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

const FETCH_RELATED = gql`
  query getRelated($concept: String!, $lim: Int!, $phase: String!) {
    Get {
      Intermediate(
        where: {
          path: ["phase", "Phase", "id"],
          operator: Equal,
          valueText: $phase
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


const enhance = async (sentenceUuid, analyzeSentence, relatedData, setRequests, setEnhanceRequests) => {
  // enhance request id must match regular requests id
  const newRequests = relatedData.map((r) => {
    return {
      id: 'ENHANCE-' + r._additional.id,
      prompt: "Find the 2-3 statements from the context that best support the following summary sentence. Return them verbatim as strings in a javascript array and order them by relevance (high to low): \nSUMMARY SENTENCE: " + analyzeSentence,
      context: "\nCONTEXT: " + r.text,
    };
  })
  setRequests(rs => [...rs, ...newRequests])
  setEnhanceRequests(rs => ({
    ...rs,
    [sentenceUuid]: relatedData.map(r => 'ENHANCE-' + r._additional.id)
  })) 
}

const Report = () => {
    const { id } = useParams();
  const { data, error, loading } = useQuery(FETCH_REPORTS, {
    variables: { id },
  });
  console.log("REPORT : ", data, error)
  const dataSourcePhaseID = data && data.Get.Report[0].workflow[0].phases.filter(p => p.type === "DATA_SOURCE")[0]._additional.id
  console.log("YOLO: ", dataSourcePhaseID)
  const apiKey = useRecoilValue(apiKeyState)
  const [requests, setRequests] = useRecoilState(requestsState);
  const [enhanceRequests, setEnhanceRequests] = useRecoilState(enhanceRequestsState);
  console.log('enhanceRequests   ', enhanceRequests)
  console.log("reports: ", data, error, loading);
  const [edit, setEdit] = React.useState(false)
  const [annotate, setAnnotate] = React.useState([])
  const [analyzeSentence, setAnalyzeSentence] = React.useState("");
  const [mapper, setMapper] = React.useState({})
  const sentenceUuid = md5(analyzeSentence)
  const sentenceResponse = useRecoilValue(requestState('REORDER-' + sentenceUuid))
  console.log('WE GET SENTENCE RESPONSE? ', sentenceResponse)
  const tryingThis = useRecoilValue(enhanceRequestResultsState(sentenceUuid))
  console.log('When does this exist: ', tryingThis)
  const [fetchRelated, { data: relatedData, error: relatedError, loading: relatedLoading }] = useLazyQuery(FETCH_RELATED, {
    variables: { concept: analyzeSentence, lim: "2", phase: dataSourcePhaseID },
    context: {
      headers: {
        "X-Openai-Api-Key": apiKey
      }
    },
  });
  React.useEffect(() => {
    console.log('TRYING THIS CHANGES: ', tryingThis)
    const itsAllHere = tryingThis ? Object.values(tryingThis).every((t) => !isEmpty(t)) : false
    if (itsAllHere) {
      const relatedSentences = Object.values(tryingThis).reduce((acc, sents) => {
        return [...acc, ...sents]
      },[])
      const mp = Object.keys(tryingThis).reduce((acc, key) => {
        const sents = tryingThis[key]
        sents.forEach(s => {
          acc[s] = key
        })
        return acc
      },{})
      console.log('ITS ALL HERE', mp, relatedSentences)
      setMapper(mp)
      setRequests(rs => [...rs, {
        id: 'REORDER-' + sentenceUuid,
        prompt: "Reorder the following javascript array of statements based on how well they support the following summary sentence from most relevant to least relevant: \nSUMMARY SENTENCE: " + analyzeSentence,
        context: "Related Sentences: " + JSON.stringify(relatedSentences),
      }])
    }
  }, [analyzeSentence, sentenceUuid, tryingThis, setRequests])

  const report = !isEmpty(data) ? data.Get.Report[0] : {};
  const text = report.text;
  const sentences = report.text ? report.text.split("\n\n") : [];
    return (
    <Box>
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
          {edit ? <Button m="20px" onClick={() => setEdit(false)}>Cancel Annotation</Button> : <Button m="20px" onClick={() => setEdit(true)}>Create New Annotation</Button>}
          
          {edit ? <TokenAnnotator tokens={sentences.join('\n').split(' ')} value={annotate} onChange={(v) => {
            console.log("WHAT V IS: ", v)
            const last = v[v.length - 1]
            setAnnotate([last])
            const newSent = sentences.join('\n').split(' ').slice(last.start, last.end).join(' ')
            console.log("WHAT newSent IS: ", newSent)
            setAnalyzeSentence(newSent)
            fetchRelated()
          }} /> : <Text fontWeight={'800'}>{text}</Text>}
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
              <Button m="20px" onClick={() => enhance(sentenceUuid, analyzeSentence, relatedData.Get.Intermediate, setRequests, setEnhanceRequests)}>Enhance Supporting Texts w/ AI</Button>
              <Text fontWeight="800">Supporting Texts</Text>
              {
                relatedData && isEmpty(enhanceRequests) ? 
                  relatedData.Get.Intermediate.map((r) => <Text mt="30px">{r.text}</Text>)
                  : relatedData.Get.Intermediate.map((r) => <Text fontWeight="800" mt="30px">{r.text}</Text>)
              }
        </Box>
      </Box>
    );


};

export default Report;
