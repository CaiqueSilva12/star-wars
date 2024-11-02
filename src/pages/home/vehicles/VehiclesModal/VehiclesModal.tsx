import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import styles from './VehiclesModal.module.css';
import { IVehicle } from '../../../../interfaces/IVehicles';

interface VehiclesModalProps {
  visible: boolean;
  onClose: () => void;
  vehicle: IVehicle | null;
}

const VehiclesModal: React.FC<VehiclesModalProps> = ({ visible, onClose, vehicle }) => {
  const [pilotNames, setPilotNames] = useState<string[]>([]);
  const [filmTitles, setFilmTitles] = useState<string[]>([]);

  const fetchData = async (urls: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const names = responses.map(response => response.data.name || response.data.title);
      setter(names);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleFetchData = () => {
    if (!vehicle) return;

    const fetchDataMappings: Array<{ key: keyof IVehicle; setter: React.Dispatch<React.SetStateAction<string[]>> }> = [
      { key: 'pilots', setter: setPilotNames },
      { key: 'films', setter: setFilmTitles },
    ];

    fetchDataMappings.forEach(({ key, setter }) => {
      const urls = vehicle[key] as string[];
      if (urls.length > 0) {
        fetchData(urls, setter);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      handleFetchData();
    }
  }, [visible, vehicle]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {vehicle ? vehicle.name : 'Detalhes do Veículo'}
      </div>
      <div className={styles.vehicleDetails}>
        {vehicle ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Modelo:</span> {vehicle.model}</div>
            <div className={styles.detail}><span className={styles.label}>Fabricante:</span> {vehicle.manufacturer}</div>
            <div className={styles.detail}><span className={styles.label}>Custo em Créditos:</span> {vehicle.cost_in_credits}</div>
            <div className={styles.detail}><span className={styles.label}>Comprimento:</span> {vehicle.length}</div>
            <div className={styles.detail}><span className={styles.label}>Velocidade Máxima:</span> {vehicle.max_atmosphering_speed}</div>
            <div className={styles.detail}><span className={styles.label}>Capacidade de Carga:</span> {vehicle.cargo_capacity}</div>
            <div className={styles.detail}><span className={styles.label}>Capacidade de Passageiros:</span> {vehicle.passengers}</div>
            <div className={styles.detail}><span className={styles.label}>Classe:</span> {vehicle.vehicle_class}</div>

            <div className={styles.detail}>
              <span className={styles.label}>Pilotos:</span>
              <div className={styles.column}>{pilotNames.length > 0 ? pilotNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhum piloto encontrado.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Filmes:</span>
              <div className={styles.column}>{filmTitles.length > 0 ? filmTitles.map((title, index) => (
                <div key={index} className={styles.detail}>{title}</div>
              )) : <p>Nenhum filme encontrado.</p>}</div>
            </div>
          </div>
        ) : (
          <p>Nenhum veículo selecionado.</p>
        )}
      </div>
    </Modal>
  );
};

export default VehiclesModal;
