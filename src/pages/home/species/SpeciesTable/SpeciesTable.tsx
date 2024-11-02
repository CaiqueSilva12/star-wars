import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../../../utils/apiRequest";
import styles from './SpeciesTable.module.css';
import SearchInput from "../../../../components/SearchInput/SearchInput";
import useWindowSize from "../../../../hooks/useWindowSize";
import { ISpecies } from "../../../../interfaces/ISpecies";
import SpeciesModal from "../SpeciesModal/SpeciesModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: ISpecies) => JSX.Element;
}

const SpeciesTable = () => {
  const [species, setSpecies] = useState<ISpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<ISpecies | null>(null);
  const pageSize = 10;
  const totalPages = 4;
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 920;

  const fetchSpecies = async (page: number, fetchAll = false) => {
    setLoading(true);
    try {
      let allSpecies = [];

      if (fetchAll) {
        const pageRequests = [];
        for (let i = 1; i <= totalPages; i++) {
          pageRequests.push(axiosInstance.get(`https://swapi.dev/api/species/?page=${i}`));
        }
        const responses = await Promise.all(pageRequests);
        allSpecies = responses.flatMap(response => response.data.results);
      } else {
        const response = await axiosInstance.get(`https://swapi.dev/api/species/?page=${page}`);
        allSpecies = response.data.results;
      }

      setSpecies(allSpecies);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchSpecies(currentPage, true);
    } else {
      fetchSpecies(currentPage);
    }
  }, [currentPage, searchText]);

  const memoizedData = useMemo(() => {
    return species.map(specie => ({
      ...specie,
      key: specie.name,
    }));
  }, [species]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(specie =>
      specie.name.toLowerCase().includes(searchText.toLowerCase())
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

  const handleOpenModal = (specie: ISpecies) => {
    setSelectedSpecies(specie);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSpecies(null);
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
          render: (_text: any, record: ISpecies) => (
            <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
              <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            </a>
          ),
        },
      ];
    }

    return [
      { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
      { title: 'Classificação', dataIndex: 'classification', key: 'classification', align: 'center' },
      { title: 'Designação', dataIndex: 'designation', key: 'designation', align: 'center' },
      { title: 'Altura Média', dataIndex: 'average_height', key: 'average_height', align: 'center' },
      { title: 'Cores da Pele', dataIndex: 'skin_colors', key: 'skin_colors', align: 'center' },
      { title: 'Linguagem', dataIndex: 'language', key: 'language', align: 'center' },
      {
        title: 'Mais Informações',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        render: (_text: any, record: ISpecies) => (
          <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </a>
        ),
      },
    ];
  }, [isSmallScreen, species]);

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
          <SpeciesModal
            visible={modalVisible} 
            onClose={handleCloseModal} 
            species={selectedSpecies} 
          />
        </>
      )}
    </div>
  );
};

export default SpeciesTable;
