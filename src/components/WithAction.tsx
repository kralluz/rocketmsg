"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuItem,
  useDisclosure,
  Stack,
  MenuItemGroup,
  MenuItemText,
} from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

interface Props {
  children: React.ReactNode;
}

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = (props: Props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Box>
  );
};

export default function WithAction() {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={open ? onClose : onOpen}
          />
          <HStack padding={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              padding={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button variant={"solid"} colorScheme={"teal"} size={"sm"} mr={4}>
              Action
            </Button>
            <MenuItemGroup>
              <MenuItemText>Link 1</MenuItemText>
              <MenuItemText>Link 2</MenuItemText>
              <MenuItemText>Link 3</MenuItemText>
            </MenuItemGroup>
          </Flex>
        </Flex>

        {open ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} padding={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>Main Content Here</Box>
    </>
  );
}
