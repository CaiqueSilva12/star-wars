// components/PlanetsTable/PlanetsTable.tsx
import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../../../utils/apiRequest";
import styles from './PlanetsTable.module.css';
import SearchInput from "../../../../components/SearchInput/SearchInput";
import useWindowSize from "../../../../hooks/useWindowSize";
import { IPlanet } from "../../../../interfaces/IPlanet";
import PlanetsModal from "../PlanetsModal/PlanetsModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: IPlanet) => JSX.Element;
}

const PlanetsTable = () => {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<IPlanet | null>(null);
  const pageSize = 10;
  const totalPages = 6;
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 920;

  const fetchPlanets = async (page: number, fetchAll = false) => {
    setLoading(true);
    try {
      let allPlanets = [];

      if (fetchAll) {
        const pageRequests = [];
        for (let i = 1; i <= totalPages; i++) {
          pageRequests.push(axiosInstance.get(`https://swapi.dev/api/planets/?page=${i}`));
        }
        const responses = await Promise.all(pageRequests);
        allPlanets = responses.flatMap(response => response.data.results);
      } else {
        const response = await axiosInstance.get(`https://swapi.dev/api/planets/?page=${page}`);
        allPlanets = response.data.results;
      }

      setPlanets(allPlanets);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchPlanets(currentPage, true);
    } else {
      fetchPlanets(currentPage);
    }
  }, [currentPage, searchText]);

  const memoizedData = useMemo(() => {
    return planets.map(planet => ({
      ...planet,
      key: planet.name,
    }));
  }, [planets]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(planet =>
      planet.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [memoizedData, searchText]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return searchText ? filteredData.slice(startIndex, startIndex + pageSize) : memoizedData;
  }, [filteredData, memoizedData, currentPage, searchText]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const page = pagination.current || 1;
    setCurrentPage(page);
  };

  const handleOpenModal = (planet: IPlanet) => {
    setSelectedPlanet(planet);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPlanet(null);
  };

  const columns: ColumnsProps[] = useMemo(() => {
    if (isSmallScreen) {
      return [
        { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
        {
          title: 'Mais Informações',
          dataIndex: 'url',
          key: 'url',
          align: 'center',
          render: (_text: any, record: IPlanet) => (
            <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
              <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            </a>
          ),
        },
      ];
    }

    return [
      { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
      { title: 'Período de Rotação', dataIndex: 'rotation_period', key: 'rotation_period', align: 'center' },
      { title: 'Período Orbital', dataIndex: 'orbital_period', key: 'orbital_period', align: 'center' },
      { title: 'Diâmetro', dataIndex: 'diameter', key: 'diameter', align: 'center' },
      { title: 'Água na Superfície', dataIndex: 'surface_water', key: 'surface_water', align: 'center' },
      { title: 'População', dataIndex: 'population', key: 'population', align: 'center' },
      {
        title: 'Mais Informações',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        render: (_text: any, record: IPlanet) => (
          <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </a>
        ),
      },
    ];
  }, [isSmallScreen, planets]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <SearchInput onSearch={setSearchText} />
          <Table
            columns={columns}
            dataSource={paginatedData}
            bordered
            size="middle"
            sticky
            showHeader
            rowKey="url"
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={searchText ? filteredData.length : totalPages * pageSize}
            onChange={page => setCurrentPage(page)}
            className={styles.pagination}
          />
          <PlanetsModal
            visible={modalVisible} 
            onClose={handleCloseModal} 
            planet={selectedPlanet} 
          />
        </>
      )}
    </div>
  );
};

export default PlanetsTable;
