import { Default } from 'components/templates/Default';
import { GetServerSideProps, NextPage } from 'next';
import Withdrawals from 'components/templates/withdrawals/Withdrawals';
import { IWithdraw } from 'utils/types';

const WithdrawalsPage: NextPage<IWithdraw> = (props) => {
  return (
    <Default pageName="Withdrawals">
      <Withdrawals {...props}/>
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://blockchain.info/ticker")
  const data = await res.json()

  return {
    props: {
      btcPrice: data["USD"]["last"],
      xprPrice: 0.001712
    },
  };
};

export default WithdrawalsPage;