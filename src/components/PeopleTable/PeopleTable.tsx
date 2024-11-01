import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../utils/apiRequest";
import { IPeople } from "../../interfaces/IPeople";
import styles from './PeopleTable.module.css';
import SearchInput from "../SearchInput/SearchInput";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
}

const columns: ColumnsProps[] = [
  { title: 'Nome', dataIndex: 'name', key: 'name', align: 'center' },
  { title: 'Altura', dataIndex: 'height', key: 'height', align: 'center' },
  { title: 'Peso', dataIndex: 'mass', key: 'mass', align: 'center' },
  { title: 'Cor do Cabelo', dataIndex: 'hair_color', key: 'hair_color', align: 'center' },
  { title: 'Cor da Pele', dataIndex: 'skin_color', key: 'skin_color', align: 'center' },
  { title: 'Gênero', dataIndex: 'gender', key: 'gender', align: 'center' },
];

const PeopleTable = () => {
  const [people, setPeople] = useState<IPeople[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const fetchPeople = async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/people/?page=${page}`);
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

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spin size="large">
            <div/>
          </Spin>
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
        </>
      )}
    </div>
  );
};

export default PeopleTable;
