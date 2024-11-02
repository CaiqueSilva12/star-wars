import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import styles from './SpeciesModal.module.css';
import { ISpecies } from '../../../../interfaces/ISpecies';

interface SpeciesModalProps {
  visible: boolean;
  onClose: () => void;
  species: ISpecies | null;
}

const SpeciesModal: React.FC<SpeciesModalProps> = ({ visible, onClose, species }) => {
  const [peopleNames, setPeopleNames] = useState<string[]>([]);
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
    if (!species) return;

    const fetchDataMappings: Array<{ key: keyof ISpecies; setter: React.Dispatch<React.SetStateAction<string[]>> }> = [
      { key: 'people', setter: setPeopleNames },
      { key: 'films', setter: setFilmTitles },
    ];

    fetchDataMappings.forEach(({ key, setter }) => {
      const urls = species[key] as string[];
      if (urls.length > 0) {
        fetchData(urls, setter);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      handleFetchData();
    }
  }, [visible, species]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {species ? species.name : 'Detalhes da Espécie'}
      </div>
      <div className={styles.speciesDetails}>
        {species ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Classificação:</span> {species.classification}</div>
            <div className={styles.detail}><span className={styles.label}>Designação:</span> {species.designation}</div>
            <div className={styles.detail}><span className={styles.label}>Altura Média:</span> {species.average_height}</div>
            <div className={styles.detail}><span className={styles.label}>Cores da Pele:</span> {species.skin_colors}</div>
            <div className={styles.detail}><span className={styles.label}>Cores do Cabelo:</span> {species.hair_colors}</div>
            <div className={styles.detail}><span className={styles.label}>Cores dos Olhos:</span> {species.eye_colors}</div>
            <div className={styles.detail}><span className={styles.label}>Linguagem:</span> {species.language}</div>
            <div className={styles.detail}><span className={styles.label}>Expectativa de Vida:</span> {species.average_lifespan}</div>

            <div className={styles.detail}>
              <span className={styles.label}>Residentes:</span>
              <div className={styles.column}>{peopleNames.length > 0 ? peopleNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhuma pessoa encontrada.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Filmes:</span>
              <div className={styles.column}>{filmTitles.length > 0 ? filmTitles.map((title, index) => (
                <div key={index} className={styles.detail}>{title}</div>
              )) : <p>Nenhum filme encontrado.</p>}</div>
            </div>
          </div>
        ) : (
          <p>Nenhuma espécie selecionada.</p>
        )}
      </div>
    </Modal>
  );
};

export default SpeciesModal;
