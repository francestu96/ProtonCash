import { Default } from 'components/templates/Default';
import { Home } from 'components/templates/home';
import type { GetServerSideProps, NextPage } from 'next';
import { readFileSync } from 'fs';

const HomePage: NextPage<any> = (props) => {
  return (
    <Default pageName="Home">
      <Home {...props}/>
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const ABI = JSON.parse(readFileSync("src/utils/BTCB_ABI.json", "utf-8"))

  return {
    props: {
      abi: ABI
    }
  }
};


export default HomePage;