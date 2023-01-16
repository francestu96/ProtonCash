import { useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Link href="/">
      <a>
        <Image
          src={colorMode === 'dark' ? '/logo-white.svg' : '/logo-black.svg'}
          height={60}
          width={200}
          alt="Proton Blockchain"
        />
      </a>
    </Link>
  );
};

export default Logo;
