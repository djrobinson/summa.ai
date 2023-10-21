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
import { useNavigate } from "react-router-dom";



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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={"white"}
        w="400px"
        boxShadow={"2xl"}
        rounded={"2xl"}
        p={6}
        
      >
      <Stack p="14px" h="full" spacing={8} maxW={'3xl'} textAlign={'justify'} justify="center">
        <Heading fontWeight="400" fontSize="5xl">
        <Text as="span" color="teal">Summa</Text><Text as="span" color="darkGray">.ai</Text>
        </Heading>
        <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
          A framework to build reusable logical workflows powered by popular LLMs to extract knowledge from your own documents without any code.
        </Text>
      </Stack>
      </Box>

      <Box maxW={'5xl'}>
        <Stack>
          <Flex gridGap={12} >
            <Stack>
              <Tag p="13px" colorScheme='teal' borderRadius='full' fontSize="20px" fontWeight={'bold'}>
                <TagLabel pl="10px">Step 1 - Set Up Your Account</TagLabel>
              </Tag>
              <Flex gridGap={6}>
              <Card
                heading={'Add Open AI API Key'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Add a key to enable access to Open AI\'s GPT-3 & GPT-4 models.'}
                href={'#'}
              />
              <Card
                heading={'Configure Model & Rate Limits'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Choose an LLM model and customize rate limits to manage LLM cost.'}
                href={'#'}
              />
              </Flex>
              <Box
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={"white"}
                boxShadow={"2xl"}
                rounded={"2xl"}
                p={4}
                
              >
                <FormLabel fontSize="sm" fontWeight={'800'}>Quick Start</FormLabel>
                <Flex justify="space-around">

                  <Button bg="teal" color="white">Add API Key</Button>
                  <Button ml="10px" bg="teal" color="white">View Rate Limit</Button>
                </Flex>
              </Box>
            </Stack>
            <Stack>
              <Tag p="13px" colorScheme='blue' borderRadius='full' fontSize="20px" fontWeight={'bold'}>
                <TagLabel pl="10px">Step 2 - Configure a Data Source</TagLabel>
              </Tag>
              <Flex gridGap={6}>
              <Card
                heading={'Import Data to Summa\'s Database'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Import PDF or TXT files, or copy and paste data from any source.'}
                href={'#'}
              />
              <Card
                heading={'Split the Data for LLM Processing'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Split the data to comply with LLM size limits.'}
                href={'#'}
              />
              </Flex>
              <Box
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={"white"}
                boxShadow={"2xl"}
                rounded={"2xl"}
                p={4}
                
              >
                <FormLabel fontSize="sm" fontWeight={'800'}>Quick Start</FormLabel>
                <Flex>
                  <Input placeholder="Data Source Name..." value={dataSourceName} onChange={(e) => setDataSourceName(e.target.value)}  />
                  <Button fontSize="12px" ml="10px" bg="teal" color="white"
                    onClick={async () => {
                      const ds = await createObject("DataSource", {
                        name: dataSourceName,
                      });
                      navigate(`/data/${ds.id}`)
                    }}    
                  >Create</Button>
                </Flex>
              </Box>
            </Stack>
          </Flex>
          <Flex  gridGap={12} mt="20px" >
            <Stack>
              <Tag p="13px" colorScheme='orange' borderRadius='full' fontSize="20px" fontWeight={'bold'}>
                <TagLabel pl="10px">Step 3 - Create a Workflow</TagLabel>
              </Tag>
              <Flex gridGap={6}>
              <Card
                heading={'Build LLM Contexts from Data Source'}
                description={'Restructure input by filtering, sorting, and limiting data source records into LLM contexts.'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                href={'#'}
              />
              <Card
                heading={'Run LLM Prompts En Masse'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Build reusable workflows that run complex logical processing on data sources.'}
                href={'#'}
              />
              </Flex>
              <Box
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={"white"}
                boxShadow={"2xl"}
                rounded={"2xl"}
                p={4}
                
              >
                <FormLabel fontSize="sm" fontWeight={'800'}>Quick Start</FormLabel>
                <Flex>
                <Input placeholder="Workflow Name..." />
                <Select
                  placeholder="Data Source..."
                  ml="10px"
                  onChange={(e) => {

                  }}

                >
                  {['test'].map((k) => (
                    <option value={k}>{k}</option>
                  ))}
                </Select>
                  
                  <Button fontSize="12px" ml="10px" bg="teal" color="white">Create</Button>
                </Flex>
              </Box>
            </Stack>
            <Stack>
              <Tag p="13px" colorScheme='purple' borderRadius='full' fontSize="20px" fontWeight={'bold'}>
                <TagLabel pl="10px">Step 4 - Publish a Report</TagLabel>
              </Tag>
              <Flex gridGap={6}>
              <Card
                heading={'Publish AI Generated Reports'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Publicize annotated reports for public viewing, retaining linkages to the original source.'}
                href={'#'}
              />
              <Card
                heading={'Cite Original Sources'}
                icon={<Icon as={FcAcceptDatabase} w={10} h={10} />}
                description={'Use AI to find supporting and opposing statements from original sources to verify reports.'}
                href={'#'}
              />
              </Flex>
              <Box
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={"white"}
                boxShadow={"2xl"}
                rounded={"2xl"}
                p={4}
                
              >
                <FormLabel fontSize="sm" fontWeight={'800'}>Quick Start</FormLabel>
                <Flex>
                <Input placeholder="Report Name..."  />
                <Select
                  placeholder="Workflow..."
                  ml="10px"
                  onChange={(e) => {

                  }}

                >
                  {['test'].map((k) => (
                    <option value={k}>{k}</option>
                  ))}
                </Select>
                  <Button fontSize="12px" ml="10px" bg="teal" color="white">Create</Button>
                </Flex>
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </Box>
    </Flex>
      

  );
};

export default Home;
