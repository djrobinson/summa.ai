"use client";

import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

import { FaPlay, FaRegSave, FaStop } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

import React from "react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { useRecoilState, useRecoilValue } from "recoil";
import Alerts from "./Alerts";
import BatchButton from "./BatchButton";
import BatchManager from "./RequestManager/BatchManager";
import RequestManager from "./RequestManager/RequestManager";
import RequestsButton from "./RequestsButton";
import {
  globalWorkflowNameState,
  showRequestManagerState,
} from "./recoil/atoms";
import { showBatchManagerState } from "./recoil/batchState";

const SidebarContent = ({ onClose, hideOptions, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="3xl">
          <Link to="/">
            <Text as="span" color="teal">
              Summa
            </Text>
            <Text as="span" color="darkGray">
              .ai
            </Text>
          </Link>
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {!hideOptions && (
        <>
          <NavItem>
            <Link to="/data">Data Sources</Link>
          </NavItem>
          <NavItem>
            <Link to="/workflows">Workflows</Link>
          </NavItem>
          <NavItem>
            <Link to="/reports">Reports</Link>
          </NavItem>
        </>
      )}
      <NavItem>
        <Link to="/account">Account</Link>
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, hideOptions }) => {
  const workflowName = useRecoilValue(globalWorkflowNameState);
  const [showRequests, setShowRequests] = useRecoilState(
    showRequestManagerState
  );

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-around" }}
    >
      <Text fontSize="3xl" justifySelf={"flex-start"}>
        <Link to="/">
          <Text as="span" color="teal">
            Summa
          </Text>
          <Text as="span" color="darkGray">
            .ai
          </Text>
        </Link>
      </Text>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Summa.ai
      </Text>
      <Stack>
        <Text fontWeight="800" fontSize="10px">
          Workflow Name
        </Text>
        <Heading size="md" fontWeight="300" color="teal.600">
          {workflowName}
        </Heading>
      </Stack>

      <Stack>
        <Text fontWeight="800" fontSize="10px">
          Workflow Controls
        </Text>
        <Box>
          <Icon mr="15px" color="teal.400" as={FaPlay} w={5} h={5} />
          <Icon mr="15px" color="maroon" as={FaStop} w={5} h={5} />
          <Icon mr="15px" color="teal.700" as={FiRefreshCcw} w={5} h={5} />
          <Icon color="teal.700" as={FaRegSave} w={5} h={5} />
        </Box>
      </Stack>

      <HStack spacing={{ base: "0", md: "6" }}>
        <HStack
          h="full"
          borderRight="solid 1px lightgray"
          borderLeft="solid 1px lightgray"
          pr="20px"
          pl="20px"
        >
          <BatchButton />
        </HStack>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RequestsButton />
        </React.Suspense>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Danny Robinson</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {!hideOptions && (
                <>
                  <MenuItem>
                    <Link to="/workflows">Workflows</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/data">Data Sources</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/reports">Reports</Link>
                  </MenuItem>
                </>
              )}
              <MenuItem>
                <Link to="/account">Account</Link>
              </MenuItem>

              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const Layout = ({ hideOptions = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showRequests, setShowRequests] = useRecoilState(
    showRequestManagerState
  );
  const [showBatches, setShowBatches] = useRecoilState(showBatchManagerState);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <MobileNav onOpen={onOpen} hideOptions={hideOptions} />
      <Box pos="relative" p="4">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Alerts
            w={showRequests || showBatches ? "calc(98% - 400px)" : "98%"}
            zIndex={5}
          />
        </React.Suspense>
        <Outlet />
        <Box
          p="20px"
          w="500px"
          style={{
            display: showRequests || showBatches ? "block" : "none",
            position: "absolute",
            right: 0,
            top: 0,
            height: "calc(100vh - 80px)",
            background: "white",
            borderLeft: "solid 1px lightgray",
          }}
        >
          {showBatches && <BatchManager />}
          {showRequests && <RequestManager />}
          <Button
            variant="outline"
            mr={3}
            onClick={() => {
              setShowRequests(false);
              setShowBatches(false);
            }}
          >
            Exit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
