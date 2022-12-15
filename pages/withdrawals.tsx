import { Default } from 'components/templates/Default';
import { GetServerSideProps, NextPage } from 'next';
import Withdrawals from 'components/templates/withdrawals/Withdrawals';
import { readFileSync } from 'fs';

const WithdrawalsPage: NextPage = (props) => {
  return (
    <Default pageName="Withdrawals">
      <Withdrawals/>
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
}

export default WithdrawalsPage;