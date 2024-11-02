import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import styles from './PlanetsModal.module.css';
import { IPlanet } from '../../../../interfaces/IPlanet';

interface PlanetsModalProps {
  visible: boolean;
  onClose: () => void;
  planet: IPlanet | null;
}

const PlanetsModal: React.FC<PlanetsModalProps> = ({ visible, onClose, planet }) => {
  const [residentNames, setResidentNames] = useState<string[]>([]);
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
    if (!planet) return;

    const fetchDataMappings: Array<{ key: keyof IPlanet; setter: React.Dispatch<React.SetStateAction<string[]>> }> = [
      { key: 'residents', setter: setResidentNames },
      { key: 'films', setter: setFilmTitles },
    ];

    fetchDataMappings.forEach(({ key, setter }) => {
      const urls = planet[key] as string[];
      if (urls.length > 0) {
        fetchData(urls, setter);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      handleFetchData();
    }
  }, [visible, planet]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {planet ? planet.name : 'Detalhes do Planeta'}
      </div>
      <div className={styles.planetDetails}>
        {planet ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Período de Rotação:</span> {planet.rotation_period}</div>
            <div className={styles.detail}><span className={styles.label}>Período Orbital:</span> {planet.orbital_period}</div>
            <div className={styles.detail}><span className={styles.label}>Diâmetro:</span> {planet.diameter}</div>
            <div className={styles.detail}><span className={styles.label}>Clima:</span> {planet.climate}</div>
            <div className={styles.detail}><span className={styles.label}>Gravidade:</span> {planet.gravity}</div>
            <div className={styles.detail}><span className={styles.label}>Terreno:</span> {planet.terrain}</div>
            <div className={styles.detail}><span className={styles.label}>Água na Superfície:</span> {planet.surface_water}</div>
            <div className={styles.detail}><span className={styles.label}>População:</span> {planet.population}</div>

            <div className={styles.detail}>
              <span className={styles.label}>Residentes:</span>
              <div className={styles.column}>{residentNames.length > 0 ? residentNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhum residente encontrado.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Filmes:</span>
              <div className={styles.column}>{filmTitles.length > 0 ? filmTitles.map((title, index) => (
                <div key={index} className={styles.detail}>{title}</div>
              )) : <p>Nenhum filme encontrado.</p>}</div>
            </div>
          </div>
        ) : (
          <p>Nenhum planeta selecionado.</p>
        )}
      </div>
    </Modal>
  );
};

export default PlanetsModal;
