import { Table, Spin, Dropdown, Checkbox, Button } from "antd";
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../../../utils/apiRequest";
import styles from './FilmsTable.module.css';
import SearchInput from "../../../../components/SearchInput/SearchInput";
import useWindowSize from "../../../../hooks/useWindowSize";
import { IFilm } from "../../../../interfaces/IFilms";
import FilmsModal from "../FilmsModal/FilmsModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: IFilm) => JSX.Element;
}

const FilmsTable = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<IFilm | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'episode_id', 'director', 'producer', 'release_date', 'url']);
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 1200;

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`https://swapi.dev/api/films/`);
      setFilms(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const memoizedData = useMemo(() => {
    return films.map(film => ({
      ...film,
      key: film.title,
    }));
  }, [films]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(film =>
      film.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [memoizedData, searchText]);

  const handleOpenModal = (film: IFilm) => {
    setSelectedFilm(film);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFilm(null);
  };

  const columns: ColumnsProps[] = useMemo(() => {
    const allColumns: ColumnsProps[] = [
      { title: 'Título', dataIndex: 'title', key: 'title', align: 'center' },
      { title: 'ID do Episódio', dataIndex: 'episode_id', key: 'episode_id', align: 'center' },
      { title: 'Diretor', dataIndex: 'director', key: 'director', align: 'center' },
      { title: 'Produtor', dataIndex: 'producer', key: 'producer', align: 'center' },
      { title: 'Data de Lançamento', dataIndex: 'release_date', key: 'release_date', align: 'center' },
      {
        title: 'Mais Informações',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        render: (_text: any, record: IFilm) => (
          <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </a>
        ),
      },
    ];

    if (isSmallScreen) {
      return allColumns.filter(column => ['title', 'url'].includes(column.key));
    } else {
      return allColumns.filter(column => visibleColumns.includes(column.key));
    }
  }, [visibleColumns, isSmallScreen]);

  const handleColumnVisibilityChange = (checkedValues: any) => {
    setVisibleColumns(checkedValues);
  };

  const columnOptions = [
    { label: 'Título', value: 'title' },
    { label: 'ID do Episódio', value: 'episode_id' },
    { label: 'Diretor', value: 'director' },
    { label: 'Produtor', value: 'producer' },
    { label: 'Data de Lançamento', value: 'release_date' },
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
            dataSource={filteredData}
            bordered
            size="middle"
            sticky
            showHeader
            rowKey="url"
          />
          <FilmsModal
            visible={modalVisible}
            onClose={handleCloseModal}
            film={selectedFilm}
          />
        </>
      )}
    </div>
  );
};

export default FilmsTable;
