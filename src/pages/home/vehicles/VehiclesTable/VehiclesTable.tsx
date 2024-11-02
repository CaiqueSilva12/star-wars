import { Table, Spin, TablePaginationConfig, Pagination } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../../../utils/apiRequest";
import styles from './VehiclesTable.module.css';
import SearchInput from "../../../../components/SearchInput/SearchInput";
import useWindowSize from "../../../../hooks/useWindowSize";
import { IVehicle } from "../../../../interfaces/IVehicles";
import VehiclesModal from "../VehiclesModal/VehiclesModal";

interface ColumnsProps {
  title: string;
  dataIndex: string;
  key: string;
  align: 'left' | 'right' | 'center';
  render?: (text: any, record: IVehicle) => JSX.Element;
}

const VehiclesTable = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const pageSize = 10;
  const totalPages = 4;
  const size = useWindowSize();
  const isSmallScreen = size.width !== undefined && size.width < 920;

  const fetchVehicles = async (page: number, fetchAll = false) => {
    setLoading(true);
    try {
      let allVehicles = [];

      if (fetchAll) {
        const pageRequests = [];
        for (let i = 1; i <= totalPages; i++) {
          pageRequests.push(axiosInstance.get(`https://swapi.dev/api/vehicles/?page=${i}`));
        }
        const responses = await Promise.all(pageRequests);
        allVehicles = responses.flatMap(response => response.data.results);
      } else {
        const response = await axiosInstance.get(`https://swapi.dev/api/vehicles/?page=${page}`);
        allVehicles = response.data.results;
      }

      setVehicles(allVehicles);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchVehicles(currentPage, true);
    } else {
      fetchVehicles(currentPage);
    }
  }, [currentPage, searchText]);

  const memoizedData = useMemo(() => {
    return vehicles.map(vehicle => ({
      ...vehicle,
      key: vehicle.name,
    }));
  }, [vehicles]);

  const filteredData = useMemo(() => {
    return memoizedData.filter(vehicle =>
      vehicle.name.toLowerCase().includes(searchText.toLowerCase())
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

  const handleOpenModal = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedVehicle(null);
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
          render: (_text: any, record: IVehicle) => (
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
        render: (_text: any, record: IVehicle) => (
          <a onClick={() => handleOpenModal(record)} style={{ cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </a>
        ),
      },
    ];
  }, [isSmallScreen, vehicles]);

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
          <VehiclesModal
            visible={modalVisible} 
            onClose={handleCloseModal} 
            vehicle={selectedVehicle} 
          />
        </>
      )}
    </div>
  );
};

export default VehiclesTable;
