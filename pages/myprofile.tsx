import { Default } from 'components/templates/Default';
import { NextPage } from 'next';
import MyProfile from 'components/templates/myprofile/MyProfile';

const WithdrawalsPage: NextPage = () => {
  return (
    <Default pageName="MyProfile">
      <MyProfile/>
    </Default>
  );
};

export default WithdrawalsPage;