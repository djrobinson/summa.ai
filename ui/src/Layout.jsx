"use client";

import { Outlet, Link } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Heading,
  Stack,
  Alert,
  AlertIcon
} from "@chakra-ui/react";

import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { showRequestManagerState,requestsState } from "./recoil/atoms";
import RequestManager from "./RequestManager/RequestManager";
import RequestsButton from "./RequestsButton";
import Alerts from "./Alerts";

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
        <Text fontSize="3xl" fontFamily="monospace" fontWeight="bold">
          <Link to="/">Summa</Link>
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {!hideOptions &&(
      <><NavItem>
        <Link to="/data">Data Sources</Link>
      </NavItem>
      <NavItem>
        <Link to="/workflows">Workflows</Link>
      </NavItem>
      <NavItem>
        <Link to="/reports">Reports</Link>
      </NavItem>
      <NavItem>
        <Link to="/requests">Requests</Link>
      </NavItem></>)}
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

const MobileNav = ({ onOpen, hideOptions, ...rest }) => {
  const [showRequests, setShowRequests] = useRecoilState(showRequestManagerState);
  
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
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
        Summa
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <RequestsButton />
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
              {!hideOptions && (<><MenuItem>
                <Link to="/workflows">Workflows</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/data">Data Sources</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/reports">Reports</Link>
              </MenuItem></>)}
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
  const [requests, setRequests] = useRecoilState(requestsState);
  const [showRequests, setShowRequests] = useRecoilState(showRequestManagerState);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
      hideOptions={hideOptions}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent hideOptions={hideOptions} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} hideOptions={hideOptions} />
      <Box pos="relative" ml={{ base: 0, md: 60 }} p="4">
        <Alerts />
        {/* Content */}
        <Outlet />
        <Box p="20px" style={{ display: showRequests ? 'block' : 'none', position: 'absolute', right: 0, top: 0, height: '100%', background: 'white'}}>
          <Heading>Active Requests</Heading>
          <RequestManager/>
          <Button variant='outline' mr={3} onClick={() => {setShowRequests(false)}}>
              Exit
          </Button>
      </Box>
      </Box>
      
      
    </Box>
  );
};

export default Layout;
