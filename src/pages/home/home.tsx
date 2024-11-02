import { Tabs } from 'antd';
import styles from './home.module.css';
import PeopleTable from "./people/PeopleTable/PeopleTable";
import Navbar from '../../components/Navbar/Navbar';
import StarshipsTable from './starships/StarshipsTable/StarshipsTable';
import VehiclesTable from './vehicles/VehiclesTable/VehiclesTable';
import PlanetsTable from './planets/PlanetsTable/PlanetsTable';
import SpeciesTable from './species/SpeciesTable/SpeciesTable';
import FilmsTable from './films/FilmsTable/FilmsTable';

const { TabPane } = Tabs;

const Home = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Star Wars</h2>
        <Tabs defaultActiveKey="1" centered type='card'>
          <TabPane tab="Pessoas" key="1">
            <PeopleTable />
          </TabPane>
          <TabPane tab="Naves" key="2">
            <StarshipsTable />
          </TabPane>
          <TabPane tab="Veículos" key="3">
            <VehiclesTable />
          </TabPane>
          <TabPane tab="Planetas" key="4">
            <PlanetsTable />
          </TabPane>
          <TabPane tab="Filmes" key="5">
            <FilmsTable />
          </TabPane>
          <TabPane tab="Espécies" key="6">
            <SpeciesTable />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Home;
