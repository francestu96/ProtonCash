import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon, Icon } from '@chakra-ui/icons';
import { Box, Flex, HStack, IconButton, useColorModeValue, useColorMode, VStack, useDisclosure, Text, Slide, Button, Popover, PopoverTrigger, PopoverContent, Stack, Link, Center } from '@chakra-ui/react';
import { ColorModeButton, Logo, NavItem } from 'components/elements';
import React, { useEffect } from 'react';
import { ConnectWallet, useAddress, useNetwork, useNetworkMismatch } from "@thirdweb-dev/react";
import { useSession, signIn, signOut } from "next-auth/react";
import NextLink from 'next/link';
import NAV_LINKS from './paths';

const Header = () => {
  const { data: session } = useSession();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();
  const address = useAddress();
  const [, switchNetwork] = useNetwork();
  const isMismatched = useNetworkMismatch();
  const linkColor =  useColorModeValue('green.50', 'gray.900');
  
  useEffect(() => {
    if (isMismatched && switchNetwork) {
      switchNetwork(parseInt(process.env.NEXT_PUBLIC_APP_CHAIN_ID || "1"));
    }
  }, [address]);

  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color" p={'10px'}>
        <Flex justify="space-between" display={['none', 'none', 'none','flex']}>
          <Logo />
          <HStack gap={'15px'} alignItems="center">
            {NAV_LINKS.map((link) => (
              <NavItem key={`link-${link.label}`} {...link} />
            ))}
          </HStack>
          <HStack alignItems="end" gap={'10px'}>
            {session ? (
              <>
                <Popover trigger={'hover'} placement={'bottom-end'}>
                  <PopoverTrigger>
                    <HStack cursor="pointer">
                      <Box mr={-5}>
                        <Text fontSize="xl" ml="-6em">Welcome <br></br>
                          <Text as="span" color="rgb(112, 59 , 235)">{session?.user?.name}
                          </Text>
                        </Text>
                      </Box>
                      <ChevronDownIcon/>
                    </HStack>
                  </PopoverTrigger>
                  <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} w={'15em'}>
                      <NextLink href="myprofile">
                        <Link role={'group'} display={'block'} p={2} rounded={'md'} _hover={{ bg: linkColor}}>                        
                          <Stack direction={'row'} align={'center'}>
                            <Box>
                              <Text transition={'all .3s ease'} _groupHover={{ color: 'green.400' }} fontWeight={500}>
                                My Profile
                              </Text>
                            </Box>
                            <Flex transition={'all .3s ease'} transform={'translateX(-10px)'} opacity={0} _groupHover={{ opacity: '100%', transform: 'translateX(0)' }} justify={'flex-end'} align={'center'} flex={1}>
                              <Icon color={'green.400'} w={5} h={5} as={ChevronRightIcon} />
                            </Flex>
                          </Stack>
                        </Link>
                      </NextLink>
                      <Button size="sm" onClick={() => signOut()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign Out</Button> 
                  </PopoverContent>
                </Popover>
                <ConnectWallet accentColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}/>
              </>
              ) : (
              <Button size="lg" onClick={() => signIn()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign In</Button> 
            )}
            <ColorModeButton />
          </HStack>
        </Flex>
        <Flex align="center" justify="space-between" display={['flex', 'flex', 'flex','none']}>
          <Logo />
          <IconButton aria-label="Open Menu" size="lg" mr={2} icon={<HamburgerIcon/>} onClick={onToggle}/>
        </Flex> 


        <Slide in={isOpen} transition={{"enter": {duration: 0.5}, "exit": {duration: 0.5}}} style={{ zIndex: 10 }}>
          <Flex w='100vw' bgColor={useColorModeValue('white', 'gray.800')} h="100vh" flexDir="column">
            <Flex justify="flex-end">
            <IconButton mt={2} mr={2} aria-label="Open Menu" size="lg" icon={<CloseIcon/>}onClick={onToggle}/>
          </Flex>
            <VStack gap={'15px'}>
                {session ? (
                  <Box mb="2">
                    <HStack gap={'10px'}>
                      <ConnectWallet accentColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}/>
                      <ColorModeButton />
                    </HStack>
                    <Center mt="1">
                      <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                          <HStack cursor="pointer">
                            <Text fontSize="xl">Welcome <br></br>
                              <Text as="span" color="rgb(112, 59 , 235)">{session?.user?.name}
                              </Text>
                            </Text>
                            <ChevronDownIcon/>
                          </HStack>
                        </PopoverTrigger>
                        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} w={'15em'}>
                            <NextLink href="myprofile">
                              <Link role={'group'} display={'block'} p={2} rounded={'md'} _hover={{ bg: linkColor }}>                        
                                <Stack direction={'row'} align={'center'}>
                                  <Box>
                                    <Text transition={'all .3s ease'} _groupHover={{ color: 'green.400' }} fontWeight={500}>
                                      My Profile
                                    </Text>
                                  </Box>
                                  <Flex transition={'all .3s ease'} transform={'translateX(-10px)'} opacity={0} _groupHover={{ opacity: '100%', transform: 'translateX(0)' }} justify={'flex-end'} align={'center'} flex={1}>
                                    <Icon color={'green.400'} w={5} h={5} as={ChevronRightIcon} />
                                  </Flex>
                                </Stack>
                              </Link>
                            </NextLink>
                            <Button size="sm" onClick={() => signOut()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign Out</Button>
                        </PopoverContent>
                      </Popover>
                    </Center>
                  </Box>
                  ) : (
                  <>
                    <HStack gap={'10px'}>
                      <Button size="lg" onClick={() => signIn()}  backgroundColor={colorMode === "dark" ? "#90cdf4" : "#3182ce"}>Sign In</Button> 
                      <ColorModeButton />
                    </HStack>
                  </>
                )}
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
