import React from "react";
import {
  createObject,
  createRelationship,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
import PromptControls from "../RequestManager/PromptControls";
import IntermediatePreview from "../components/IntermediatePreview";
import HighlightText from "../components/HighlightText";

const FETCH_REPORTS = gql`
  query getReport($id: String!) {
    Get {
      Report(where: { operator: Equal, path: ["id"], valueString: $id }) {
        _additional {
          id
        }
        text
        title
        annotations {
          ... on Annotation {
            _additional {
              id
            }
            reportHighlightText
            intermediateHighlightText
            intermediateText
          }
        }
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
      prompt: "Find the 2-3 quotes from the provided context that best support the following summary sentence. Return them verbatim as strings in a javascript array and order them by relevance (high to low): \nSUMMARY SENTENCE: " + analyzeSentence,
      context: "\nCONTEXT: " + r.text,
    };
  })
  setRequests(rs => [...rs, ...newRequests])
  setEnhanceRequests(rs => ({
    ...rs,
    [sentenceUuid]: relatedData.map(r => 'ENHANCE-' + r._additional.id)
  })) 
}

const PreviewIntermediate = ({ text, intermediateID, setHighlightIntermediate }) => {

  return (<Box h="200px">
        <Box pos="relative" w="full" bg="blue">
        <Box pos="absolute" h="200px" w="full" overflowY="hidden">
          <Text fontWeight="800" fontSize="12px">Context</Text>

          <Text>
            {text}
          </Text>

          </Box>
          <Box pos="absolute" h="200px" w="full" style={{ 
            zIndex: 3,
            background: `linear-gradient(transparent 0%, white)` 
          }}>
            <Flex w="full" h="full" align="flex-end" justify="flex-end">
            <Button variant="outline"  w="120px" bg="teal" color="white" size="xs" onClick={() => {
              setHighlightIntermediate(intermediateID)
            }}>Annotate</Button>
            </Flex>
          </Box>
        </Box>
      </Box>)

}

const PreviewAIEnhanced = ({reportID, analyzeSentence, text, mapper, intermediates, setHighlightIntermediate, setHighlightText}) => {
  const intermediateID = mapper[text] ? mapper[text].replace('ENHANCE-', '') : null
  const related = mapper[text] ? intermediates.filter(i => i._additional.id === intermediateID) : []
  const relatedIntId = related[0] ? related[0]._additional.id : null
  const passage = related[0].text.replaceAll('\n', ' ')
  const splitText = related[0] ? passage.split(text) : ["", ""]
  const afterText = splitText[1]
  const beforeText = splitText[0].slice(splitText[0].length - 100, splitText[0].length)
  return (<Box h="200px">
        <Box pos="relative" w="full" bg="blue">
        <Box pos="absolute" h="200px" w="full" overflowY="hidden">
          <Text fontWeight="800" fontSize="12px">Context</Text>
          <Text>
          <Text as="span">
            {beforeText + " "}
          </Text>
          <Text as="span" bg="yellow">
            {text  + " "}
          </Text>
          <Text as="span">
            {afterText}
          </Text></Text>
          </Box>
          <Box pos="absolute" h="200px" w="full" style={{ 
            zIndex: 3,
            background: `linear-gradient(transparent 0%, white)` 
          }}>
            <Flex w="full" h="full" align="flex-end" justify="flex-end">
            <Button variant="outline"  w="120px" bg="white" color="teal" size="xs" onClick={() => {
              setHighlightIntermediate(intermediateID)
              setHighlightText(text)
            }}>View</Button>
            <Button variant="outline"  w="120px" bg="teal" color="white" size="xs" onClick={async () => {
              const ann = await createObject("Annotation", {
                intermediateText: passage,
                reportHighlightText: analyzeSentence,
                intermediateHighlightText: text,
              });
              console.log("ANN ", ann)
              await createRelationship(
                "Report",
                reportID,
                "annotations",
                "Annotation",
                ann.id,
                "report"
              );
              await createRelationship(
                "Intermediate",
                relatedIntId,
                "annotations",
                "Annotation",
                ann.id,
                "intermediate"
              );
              console.log("DONE!")
            }}>Create Annotation</Button>
            </Flex>
          </Box>
        </Box>
      </Box>)
}

const Report = () => {
    const { id } = useParams();
  const { data, error, loading } = useQuery(FETCH_REPORTS, {
    variables: { id },
  });
  console.log("REPORT : ", data, error)
  const reportAnnotations = data && data.Get.Report[0].annotations || []
  const dataSourcePhaseID = data && data.Get.Report[0].workflow[0].phases.filter(p => p.type === "DATA_SOURCE")[0]._additional.id
  const reportHighlights = reportAnnotations && reportAnnotations.length > 0 ? reportAnnotations : []
  console.log("YOLO: ", reportHighlights)
  const apiKey = useRecoilValue(apiKeyState)
  const [requests, setRequests] = useRecoilState(requestsState);
  const [enhanceRequests, setEnhanceRequests] = useRecoilState(enhanceRequestsState);
  console.log('enhanceRequests   ', enhanceRequests)
  console.log("reports: ", data, error, loading);
  const [edit, setEdit] = React.useState(false)
  const [annotate, setAnnotate] = React.useState([])
  const [analyzeSentence, setAnalyzeSentence] = React.useState("");
  const [mapper, setMapper] = React.useState({})
  const [highlightIntermediate, setHighlightIntermediate] = React.useState(null)
  const [highlightText, setHighlightText] = React.useState(null)
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
        prompt: "Reorder the following javascript array of statements based on how well they support the following summary sentence from most relevant to least relevant. Return your response as a javascript array: \nSUMMARY SENTENCE: " + analyzeSentence,
        context: "Related Sentences: " + JSON.stringify(relatedSentences),
      }])
    }
  }, [analyzeSentence, sentenceUuid, tryingThis, setRequests])

  const report = !isEmpty(data) ? data.Get.Report[0] : {}
  const text = report.text
  const sentences = report.text ? report.text.split("\n\n") : []
  const intermediates = relatedData?.Get?.Intermediate || []
  const reordereds = sentenceResponse.result ? JSON.parse(sentenceResponse.result) : []
  console.log("REORDEDS? ", reordereds, annotate)
    return (
      <>
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
          
          {edit ? <TokenAnnotator tokens={sentences.join(' ').split(' ')} value={annotate} onChange={(v) => {
            console.log("WHAT V IS: ", v)
            const last = v[v.length - 1]
            if (last) {

              const splitNewSent = sentences.join(' ').split(' ').slice(last.start, last.end)
              console.log('splitNewSent ', splitNewSent)
              const newSent = [...splitNewSent].join(' ')
              const secondToLast = !isEmpty(splitNewSent) ? splitNewSent[splitNewSent.length - 1] : ''
              console.log('secondToLast ', secondToLast)
              if (secondToLast.includes('. ')) {
                setAnnotate([{ ...last, end: last.end - 1 }])
              } else {
                setAnnotate([last])
              }
              console.log("WHAT newSent IS: ", newSent)
              setAnalyzeSentence(newSent)
              fetchRelated()
            }
          }} /> : <HighlightText text={text} highlightTexts={reportHighlights} />}
        </Box>
        {!isEmpty(analyzeSentence) && <Box
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
              <Button m="20px" onClick={() => enhance(sentenceUuid, analyzeSentence, intermediates, setRequests, setEnhanceRequests)}>Enhance Supporting Texts w/ AI</Button>
              { 
                isEmpty(reordereds) && isEmpty(enhanceRequests) && intermediates.map((r) => <PreviewIntermediate text={r.text} intermediateID={r._additional.id} setHighlightIntermediate={setHighlightIntermediate} />)
              }

              {
                isEmpty(reordereds) &&!isEmpty(enhanceRequests) &&
                  intermediates.map((r) => <PromptControls id={'ENHANCE-' + r._additional.id} />)}
              {
                isEmpty(reordereds) && !isEmpty(sentenceResponse) && <PromptControls id={'REORDER-' + sentenceUuid} />
              }
              {
                !isEmpty(reordereds) && reordereds.map(r => <PreviewAIEnhanced analyzeSentence={analyzeSentence} reportID={id} setHighlightText={setHighlightText} setHighlightIntermediate={setHighlightIntermediate} text={r} mapper={mapper} intermediates={intermediates} />)
              }
        </Box>}
      </Box>
      {
      !isEmpty(highlightIntermediate) && (
        <Modal isOpen={!isEmpty(highlightIntermediate)} onClose={() => {setHighlightIntermediate(null)}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reader</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <IntermediatePreview id={highlightIntermediate} highlightText={highlightText} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {setHighlightIntermediate(null)}}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )
    }</>
    );


};

export default Report;
