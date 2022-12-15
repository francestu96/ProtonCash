import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === 'dark' ? '/logo-white.svg' : '/logo-black.svg'}
      height={60}
      width={200}
      alt="Proton Blockchain"
    />
  );
};

export default Logo;
