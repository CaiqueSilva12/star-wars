import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../utils/apiRequest";
import { IPeople } from "../../interfaces/IPeople";
import styles from './PeopleTable.module.css';
import SearchInput from "../SearchInput/SearchInput";
import PeopleModal from "../PeopleModal/PeopleModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: IPeople) => JSX.Element;
}

const PeopleTable = () => {
  const [people, setPeople] = useState<IPeople[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<IPeople | null>(null);

  const fetchPeople = async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`https://swapi.dev/api/people/?page=${page}`);
      setPeople(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(currentPage);
  }, [currentPage]);

  const memoizedData = useMemo(() => {
    return people.map(person => ({
      ...person,
      key: person.name,
    }));
  }, [people]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(person => 
      person.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [memoizedData, searchText]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const page = pagination.current || 1;
    setCurrentPage(page);
  };

  const handleOpenModal = (person: IPeople) => {
    setSelectedPerson(person);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPerson(null);
  };

  const columns: ColumnsProps[] = [
    { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Altura', dataIndex: 'height', key: 'height', align: 'center' },
    { title: 'Peso', dataIndex: 'mass', key: 'mass', align: 'center' },
    { title: 'Cor do Cabelo', dataIndex: 'hair_color', key: 'hair_color', align: 'center' },
    { title: 'Cor da Pele', dataIndex: 'skin_color', key: 'skin_color', align: 'center' },
    { title: 'Gênero', dataIndex: 'gender', key: 'gender', align: 'center' },
    {
      title: 'Mais Informações',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      render: (_text: any, record: IPeople) => (
        <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
          <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
        </a>
      ),
    }
  ];

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
            dataSource={filteredData}
            bordered
            size="middle"
            sticky
            showHeader
            rowKey="peopleTable"
            pagination={false}
            onChange={handleTableChange}
          />
          <Pagination
            current={currentPage}
            pageSize={10}
            total={86}
            onChange={page => setCurrentPage(page)}
            className={styles.pagination}
          />
          {/* Adicionar o modal aqui */}
          <PeopleModal
            visible={modalVisible} 
            onClose={handleCloseModal} 
            person={selectedPerson} 
          />
        </>
      )}
    </div>
  );
};

export default PeopleTable;
