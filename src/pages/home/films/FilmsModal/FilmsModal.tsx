import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import styles from './FilmsModal.module.css';
import { IFilm } from '../../../../interfaces/IFilms';

interface FilmsModalProps {
  visible: boolean;
  onClose: () => void;
  film: IFilm | null;
}

const FilmsModal: React.FC<FilmsModalProps> = ({ visible, onClose, film }) => {
  const [characterNames, setCharacterNames] = useState<string[]>([]);
  const [planetNames, setPlanetNames] = useState<string[]>([]);
  const [starshipTitles, setStarshipTitles] = useState<string[]>([]);
  const [vehicleNames, setVehicleNames] = useState<string[]>([]);
  const [speciesNames, setSpeciesNames] = useState<string[]>([]);

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
    if (!film) return;

    const fetchDataMappings: Array<{ key: keyof IFilm; setter: React.Dispatch<React.SetStateAction<string[]>> }> = [
      { key: 'characters', setter: setCharacterNames },
      { key: 'planets', setter: setPlanetNames },
      { key: 'starships', setter: setStarshipTitles },
      { key: 'vehicles', setter: setVehicleNames },
      { key: 'species', setter: setSpeciesNames },
    ];

    fetchDataMappings.forEach(({ key, setter }) => {
      const urls = film[key] as string[];
      if (urls.length > 0) {
        fetchData(urls, setter);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      handleFetchData();
    }
  }, [visible, film]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {film ? film.title : 'Detalhes do Filme'}
      </div>
      <div className={styles.filmDetails}>
      <div className={styles.openingDetail}>
        <div className={styles.openingLabel}>Abertura:</div>
        <div className={styles.openingText}>{film?.opening_crawl}</div>
      </div>
        {film ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Diretor:</span> {film.director}</div>
            <div className={styles.detail}><span className={styles.label}>Produtor:</span> {film.producer}</div>
            <div className={styles.detail}><span className={styles.label}>Data de Lançamento:</span> {film.release_date}</div>

            <div className={styles.detail}>
              <span className={styles.label}>Planetas:</span>
              <div className={styles.column}>{planetNames.length > 0 ? planetNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhum planeta encontrado.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Personagens:</span>
              <div className={styles.column}>{characterNames.length > 0 ? characterNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhum personagem encontrado.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Naves:</span>
              <div className={styles.column}>{starshipTitles.length > 0 ? starshipTitles.map((title, index) => (
                <div key={index} className={styles.detail}>{title}</div>
              )) : <p>Nenhuma nave encontrada.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Veículos:</span>
              <div className={styles.column}>{vehicleNames.length > 0 ? vehicleNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhum veículo encontrado.</p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Espécies:</span>
              <div className={styles.column}>{speciesNames.length > 0 ? speciesNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p>Nenhuma espécie encontrada.</p>}</div>
            </div>
          </div>
        ) : (
          <p>Nenhum filme selecionado.</p>
        )}
      </div>
    </Modal>
  );
};

export default FilmsModal;
