import { Default } from 'components/templates/Default';
import { Home } from 'components/templates/home';

const HomePage: NextPage<any> = (props) => {
  return (
    <Default pageName="Home">
      <Home {...props}/>
    </Default>
  );
};

export default HomePage;