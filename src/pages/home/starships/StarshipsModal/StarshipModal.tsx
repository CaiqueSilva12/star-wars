import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import { IStarship } from '../../../../interfaces/IStarship';
import styles from './StarshipsModal.module.css';

interface StarshipsModalProps {
  visible: boolean;
  onClose: () => void;
  starship: IStarship | null;
}

const StarshipsModal: React.FC<StarshipsModalProps> = ({ visible, onClose, starship }) => {
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
    if (!starship) return;

    const fetchDataMappings: Array<{ key: keyof IStarship; setter: React.Dispatch<React.SetStateAction<string[]>> }> = [
      { key: 'pilots', setter: setPilotNames },
      { key: 'films', setter: setFilmTitles },
    ];

    fetchDataMappings.forEach(({ key, setter }) => {
      const urls = starship[key] as string[];
      if (urls.length > 0) {
        fetchData(urls, setter);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      handleFetchData();
    }
  }, [visible, starship]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {starship ? starship.name : 'Detalhes da Nave'}
      </div>
      <div className={styles.starshipDetails}>
        {starship ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Modelo:</span> {starship.model}</div>
            <div className={styles.detail}><span className={styles.label}>Fabricante:</span> {starship.manufacturer}</div>
            <div className={styles.detail}><span className={styles.label}>Custo em Créditos:</span> {starship.cost_in_credits}</div>
            <div className={styles.detail}><span className={styles.label}>Velocidade Máxima:</span> {starship.max_atmosphering_speed}</div>
            <div className={styles.detail}><span className={styles.label}>Capacidade de Carga:</span> {starship.cargo_capacity}</div>
            <div className={styles.detail}><span className={styles.label}>Capacidade de Passageiros:</span> {starship.passengers}</div>
            <div className={styles.detail}><span className={styles.label}>Classe:</span> {starship.starship_class}</div>

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
          <p>Nenhuma nave selecionada.</p>
        )}
      </div>
    </Modal>
  );
};

export default StarshipsModal;
