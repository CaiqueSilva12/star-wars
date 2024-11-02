import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../../../utils/apiRequest";
import { IStarship } from "../../../../interfaces/IStarship";
import styles from './StarshipsTable.module.css';
import SearchInput from "../../../../components/SearchInput/SearchInput";
import useWindowSize from "../../../../hooks/useWindowSize";
import StarshipsModal from "../StarshipsModal/StarshipModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: IStarship) => JSX.Element;
}

const StarshipsTable = () => {
  const [starships, setStarships] = useState<IStarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStarship, setSelectedStarship] = useState<IStarship | null>(null);
  const pageSize = 10;
  const totalPages = 4;
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 920;

  const fetchStarships = async (page: number, fetchAll = false) => {
    setLoading(true);
    try {
      let allStarships = [];

      if (fetchAll) {
        const pageRequests = [];
        for (let i = 1; i <= totalPages; i++) {
          pageRequests.push(axiosInstance.get(`https://swapi.dev/api/starships/?page=${i}`));
        }
        const responses = await Promise.all(pageRequests);
        allStarships = responses.flatMap(response => response.data.results);
      } else {
        const response = await axiosInstance.get(`https://swapi.dev/api/starships/?page=${page}`);
        allStarships = response.data.results;
      }

      setStarships(allStarships);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchStarships(currentPage, true);
    } else {
      fetchStarships(currentPage);
    }
  }, [currentPage, searchText]);

  const memoizedData = useMemo(() => {
    return starships.map(starship => ({
      ...starship,
      key: starship.name,
    }));
  }, [starships]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(starship =>
      starship.name.toLowerCase().includes(searchText.toLowerCase())
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

  const handleOpenModal = (starship: IStarship) => {
    setSelectedStarship(starship);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStarship(null);
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
          render: (_text: any, record: IStarship) => (
            <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
              <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            </a>
          ),
        },
      ];
    }

    return [
      { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
      { title: 'Modelo', dataIndex: 'model', key: 'model', align: 'center' },
      { title: 'Fabricante', dataIndex: 'manufacturer', key: 'manufacturer', align: 'center' },
      { title: 'Custo em Créditos', dataIndex: 'cost_in_credits', key: 'cost_in_credits', align: 'center' },
      { title: 'Comprimento', dataIndex: 'length', key: 'length', align: 'center' },
      { title: 'Velocidade Máxima', dataIndex: 'max_atmosphering_speed', key: 'max_atmosphering_speed', align: 'center' },
      {
        title: 'Mais Informações',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        render: (_text: any, record: IStarship) => (
          <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </a>
        ),
      },
    ];
  }, [isSmallScreen, starships]);

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
          <StarshipsModal
            visible={modalVisible} 
            onClose={handleCloseModal} 
            starship={selectedStarship} 
          />
        </>
      )}
    </div>
  );
};

export default StarshipsTable;
