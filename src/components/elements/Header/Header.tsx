import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, IconButton, useColorModeValue, useColorMode, VStack, useDisclosure, Text, ScaleFade, Slide, Button, Center } from '@chakra-ui/react';
import { ColorModeButton, Logo, NavItem } from 'components/elements';
import React, { useEffect } from 'react';
import { ConnectWallet, useAddress, useNetwork, useNetworkMismatch } from "@thirdweb-dev/react";
import { useSession, signIn } from "next-auth/react";
import NAV_LINKS from './paths';

const Header = () => {
  const { data: session } = useSession();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();
  const address = useAddress();
  const [, switchNetwork] = useNetwork();
  const isMismatched = useNetworkMismatch();
  
  useEffect(() => {
    if (isMismatched && switchNetwork) {
      switchNetwork(parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID || "1"));
    }
  }, [address]);

  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color" p={'10px'}>
        <Flex justify="space-between" display={['none', 'none', 'flex','flex']}>
          <Logo />
          <HStack gap={'15px'} alignItems="center">
            {NAV_LINKS.map((link) => (
              <NavItem key={`link-${link.label}`} {...link} />
            ))}
          </HStack>
          <HStack alignItems="end" gap={'10px'}>
            {session ? (
              <>
                <Text fontSize="xl" ml="-6em">Welcome <br></br><Text as="span" color="rgb(112, 59 , 235)">{session?.user?.name}</Text></Text>
                <ConnectWallet accentColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}/>
              </>
              ) : (
              <Button size="lg" onClick={() => signIn()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign in</Button> 
            )}
            <ColorModeButton />
          </HStack>
        </Flex>
        <Flex align="center" justify="space-between" display={['flex', 'flex', 'none','none']}>
          <Logo />
          <IconButton aria-label="Open Menu" size="lg" mr={2} icon={<HamburgerIcon/>} onClick={onToggle}/>
        </Flex> 


        <Slide in={isOpen} transition={{"enter": {duration: 0.5}, "exit": {duration: 0.5}}} style={{ zIndex: 10 }}>
          <Flex w='100vw' bgColor={useColorModeValue('white', 'gray.800')} h="100vh" flexDir="column">
            <Flex justify="flex-end">
            <IconButton mt={2} mr={2} aria-label="Open Menu" size="lg" icon={<CloseIcon/>}onClick={onToggle}/>
          </Flex>
            <VStack gap={'15px'}>
              <HStack gap={'10px'}>
                {session ? (
                  <ConnectWallet accentColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}/>
                  ) : (
                  <Button size="lg" onClick={() => signIn()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign in</Button> 
                )}
                <ColorModeButton />
              </HStack>
              {NAV_LINKS.map((link) => (
                <NavItem key={`link-${link.label}`} {...link} />
              ))}
            </VStack>
          </Flex>   
        </Slide> 
    </Box>
  );
};

export default Header;
