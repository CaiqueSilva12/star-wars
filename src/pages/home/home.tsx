import styles from './home.module.css';
import PeopleTable from "../../components/PeopleTable/PeopleTable";
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className={styles.container}>
        <h2 className={styles.title}>Star Wars</h2>
        <PeopleTable />
      </div>
    </>
  );
};

export default Home;
