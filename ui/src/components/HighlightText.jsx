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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useLazyQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";
import { createObject } from "../utils/weaviateServices";

const CharacterRenderer = ({ character, index, annotations = [], setModalIntermediate = () => {} }) => {
    if (annotations.length === 0) {
        return <Text as="span">{character}</Text>
    }
    const annotation = annotations.filter((annotation) => {
        return index >= annotation.startToken && index <= annotation.endToken
    })
    if (annotation.length > 0) {
        return <Text onClick={() => {
            setModalIntermediate(annotation)
        }} as="span" bg="yellow" fontWeight="600">{character}</Text>
    }
    return <Text as="span">{character}</Text>
}


const IntermediateHighlightText = ({ text, highlightTexts =[] }) => {
    const annotations = []
    const [selectedAnnotations, setSelectedAnnotations] = React.useState(null)
    highlightTexts.forEach((highlightText) => {
        console.log("TEXT ",  highlightText)
        const splitTextStart = text.indexOf(highlightText.intermediateHighlightText)
        const splitTextEnd = splitTextStart + highlightText.intermediateHighlightText.length
        annotations.push({ ...highlightText, startToken: splitTextStart, endToken: splitTextEnd})
    })
    console.log(selectedAnnotations, annotations)
  return (
    <>
        <Box mt="10px">
            <Text>{text ? text.split("").map((t, i) => <CharacterRenderer setModalIntermediate={setSelectedAnnotations} character={t} index={i} annotations={annotations} />) : ''}</Text>
        </Box>
 
    </>
  );
}


const HighlightText = ({ text, highlightTexts =[] }) => {
    const annotations = []
    const [selectedAnnotations, setSelectedAnnotations] = React.useState(null)
    highlightTexts.forEach((highlightText) => {
        console.log("TEXT ",  highlightText)
        const splitTextStart = text.indexOf(highlightText.reportHighlightText)
        const splitTextEnd = splitTextStart + highlightText.reportHighlightText.length
        annotations.push({ ...highlightText, startToken: splitTextStart, endToken: splitTextEnd})
    })
    console.log(selectedAnnotations, annotations)
  return (
    <>
        <Box mt="10px">
            <Text>{text ? text.split("").map((t, i) => <CharacterRenderer setModalIntermediate={setSelectedAnnotations} character={t} index={i} annotations={annotations} />) : ''}</Text>
        </Box>
        {
      !isEmpty(selectedAnnotations) && (
        <Modal isOpen={!isEmpty(selectedAnnotations)} onClose={() => {setSelectedAnnotations([])}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Original Text</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
                selectedAnnotations.map(sa => <IntermediateHighlightText text={sa.intermediateText} highlightTexts={selectedAnnotations} />)
            }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {setSelectedAnnotations(null)}}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )
    }
    </>
  );
};

export default HighlightText;
