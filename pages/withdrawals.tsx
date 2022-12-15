import { Default } from 'components/templates/Default';
import { NextPage } from 'next';
import Withdrawals from 'components/templates/withdrawals/Withdrawals';

const WithdrawalsPage: NextPage = () => {
  return (
    <Default pageName="Withdrawals">
      <Withdrawals/>
    </Default>
  );
};

export default WithdrawalsPage;