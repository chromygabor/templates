import { Box, Button, Flex, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export interface INavBarProps {}

const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

  const navBarContent = () => {
    if (fetching) {
      return "fetching...";
    } else if (!data?.me) {
      return (
        <>
          <NextLink href="/login">
            <Link mr={2} color={"white"}>
              login
            </Link>
          </NextLink>
          <NextLink href="/register">
            <Link color={"white"}>register</Link>
          </NextLink>
        </>
      );
    } else {
      return (
        <Flex>
          <Box>{data.me.username}</Box>
          <Box>
            <Button onClick={() => logout()} variant={"link"} ml={4}>
              logout
            </Button>
          </Box>
        </Flex>
      );
    }
  };

  return (
    <Flex bg="tomato" p={4} ml={"auto"}>
      <Box ml={"auto"}>{navBarContent()}</Box>
    </Flex>
  );
};

export default NavBar;
