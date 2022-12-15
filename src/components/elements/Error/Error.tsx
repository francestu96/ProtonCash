import { useColorMode, useColorModeValue, VStack, Text, Image } from '@chakra-ui/react';

const Error = (props: any) => {
  const { colorMode } = useColorMode();
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <VStack border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="0px 2em 2em 2em">
      <Image src={colorMode === 'dark' ? '/connect-dark.png' : '/connect-light.png'} boxSize="50%" alt="Connect Wallet First" marginBottom="2em"/>
      <Text dangerouslySetInnerHTML={{__html: props.msg}}></Text>
    </VStack>
  );
};

export default Error;
