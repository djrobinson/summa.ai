import React from "react";


import { HiOutlineKey } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";
import { ImPageBreak } from "react-icons/im";
import { BsDatabaseAdd } from "react-icons/bs";
import { FaProjectDiagram, FaCogs } from "react-icons/fa";
import { TbReportSearch } from 'react-icons/tb'
import { IoNewspaperOutline } from 'react-icons/io5'
import { GoWorkflow } from 'react-icons/go'

import {
  FcAbout,
  FcAcceptDatabase,
  FcCollaboration,
  FcDonate,
  FcManager,
} from 'react-icons/fc'

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
  Icon,
  Container,
  Stack,
  Tag,
  TagLabel,
  ButtonGroup,
  Select,
} from "@chakra-ui/react";
import { createObject } from "./utils/weaviateServices";
import { Link, useNavigate } from "react-router-dom";



const Card = ({ heading, description, icon, href }) => {
  return (
    <Box
      maxW={{ base: 'full', md: '275px' }}
      w={'full'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow={"2xl"}
      p={5}>
      <Stack align={'start'} spacing={2}>
        {icon && <Flex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          bg={'gray.100'}>
          {icon}
        </Flex>}
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={'sm'}>
            {description}
          </Text>
        </Box>
        <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
          Read the docs
        </Button>
      </Stack>
    </Box>
  )
}

const Home = () => {
  const [newWorkflowTitle, setNewWorkflowTitle] = React.useState("");
  const [dataSourceName, setDataSourceName] = React.useState("");
  const navigate = useNavigate();
  return (
    <Flex p={4} gridGap={12}>
      <Box
        bg={"white"}
        w="400px"
        boxShadow={"2xl"}
        rounded={"2xl"}
        p={6}
        
      >
      <Stack p="14px" h="full" spacing={8} maxW={'3xl'} textAlign={'justify'} justify="center">
        <Heading fontWeight="400" fontSize="5xl" textAlign={'center'}>
        <Text as="span" color="teal">Summa</Text><Text as="span" color="darkGray">.ai</Text>
        </Heading>
        <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
          A framework to build reusable logical workflows powered by popular LLMs to extract knowledge from your own documents without any code.
        </Text>
      </Stack>
      </Box>

      <Box
        h="750px"
       bg={"white"}
        w="400px"
        boxShadow={"2xl"}
        rounded={"2xl"}
        textAlign={'center'}
        p={6}>
        <Link to="/data"><Heading fontWeight="400" fontSize="2xl" >Data Sources</Heading></Link>
      </Box>
      <Box
        h="750px"
       bg={"white"}
        w="400px"
        boxShadow={"2xl"}
        rounded={"2xl"}
        textAlign={'center'}
        p={6}>
        <Link to="/workflows"><Heading fontWeight="400" fontSize="2xl" >Workflows</Heading></Link>
      </Box>
    </Flex>
      

  );
};

export default Home;
