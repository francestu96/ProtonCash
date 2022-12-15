import { Icon, ChevronRightIcon } from '@chakra-ui/icons';
import { useColorModeValue, Stack, Flex, Box, Text, Link, Image } from '@chakra-ui/react';

export interface ISubNav {
  label: string;
  src?: string;
  subLabel?: string;
  logo?: string;
  href?: string;
  children?: Array<ISubNav>;
}

const SubNav = ({ label, href, subLabel, logo }: ISubNav) => {
  return (
    <Link
      target="_blank"
      href={href || '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('green.50', 'gray.900') }}
    >
      
      <Stack direction={'row'} align={'center'}>
        <Image src={logo} width={46} height={46} id={`${label}-navitem`} />
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'green.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'green.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

export default SubNav;
