import { Table, Spin, TablePaginationConfig, Pagination, Dropdown, Checkbox, Button } from "antd";
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
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
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'url']);
  
  const pageSize = 10;
  const totalPages = 4;
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 1200;

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
    fetchSpecies(currentPage);
  }, [currentPage]);

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
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

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

  const handleColumnVisibilityChange = (checkedValues: any) => {
    setVisibleColumns(checkedValues);
  };

  const columns: ColumnsProps[] = useMemo(() => {
    const allColumns: ColumnsProps[] = [
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

    if (isSmallScreen) {
      return allColumns.filter(column => ['name', 'url'].includes(column.key));
    } else {
      return allColumns.filter(column => visibleColumns.includes(column.key));
    }
  }, [visibleColumns, isSmallScreen]);

  const columnOptions = [
    { label: 'Nome', value: 'name' },
    { label: 'Classificação', value: 'classification' },
    { label: 'Designação', value: 'designation' },
    { label: 'Altura Média', value: 'average_height' },
    { label: 'Cores da Pele', value: 'skin_colors' },
    { label: 'Linguagem', value: 'language' },
    { label: 'Mais Informações', value: 'url' },
  ];

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className={styles.searchFilterContainer}>
            <SearchInput onSearch={setSearchText} />
            <Dropdown
              overlay={
                <Checkbox.Group
                  options={columnOptions}
                  defaultValue={visibleColumns}
                  onChange={handleColumnVisibilityChange}
                />
              }
              trigger={['click']}
            >
              <Button icon={<SettingOutlined />}>Filtrar Colunas</Button>
            </Dropdown>
          </div>
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
            total={filteredData.length}
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
