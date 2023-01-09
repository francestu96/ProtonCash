import { Flex, HStack, Link, Text, VStack, Image } from '@chakra-ui/react';

const Footer = () => (
  <>
  <Flex margin="auto" marginTop="2em" maxW="container.lg" justify="space-between" p={3} borderTopWidth='1px' borderTopRadius='lg' display={["none", "flex", "flex", "flex"]} fontSize={["xs", "xs", "sm", "sm"]}>
    <Text color="gray.400">
      © 2022 Metallicus Inc
    </Text>
    <Text color="gray.400">
      660 4th Street, #107, San Francisco, CA 94107, United States
    </Text>
    <HStack>
      <Link href="https://twitter.com/protonxpr" isExternal alignItems={'center'}><Image src="twitter-logo.svg" w="20px" h="20px" m={1}/></Link>
      <Link href="https://t.me/protonxpr" isExternal alignItems={'center'}><Image src="telegram-logo.svg" w="20px" h="20px" m={1}/></Link>
    </HStack>
  </Flex>
  <Flex margin="auto" marginTop="2em" maxW="container.lg" p={3} borderTopWidth='1px' borderTopRadius='lg' display={["block", "none", "none", "none"]} fontSize={["xs", "xs", "sm", "sm"]}>
    <VStack>
      <HStack>
        <Link href="https://twitter.com/protonxpr" isExternal alignItems={'center'}><Image src="twitter-logo.svg" w="20px" h="20px" m={1}/></Link>
        <Link href="https://t.me/protonxpr" isExternal alignItems={'center'}><Image src="telegram-logo.svg" w="20px" h="20px" m={1}/></Link>
      </HStack>
      <Text color="gray.400">
        © 2022 Metallicus Inc
      </Text>
      <Text color="gray.400">
        660 4th Street, #107, San Francisco, CA 94107, United States
      </Text>
    </VStack>
  </Flex>
  </>
);

export default Footer;
