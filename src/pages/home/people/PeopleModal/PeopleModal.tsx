import React, { useState } from 'react';
import { Modal } from 'antd';
import axios from 'axios';
import { IPeople } from '../../../../interfaces/IPeople';
import styles from './PeopleModal.module.css';

interface PersonModalProps {
  visible: boolean;
  onClose: () => void;
  person: IPeople | null;
}

const PersonModal: React.FC<PersonModalProps> = ({ visible, onClose, person }) => {
  const [planetName, setPlanetName] = useState<string>('');
  const [filmTitles, setFilmTitles] = useState<string[]>([]);
  const [speciesNames, setSpeciesNames] = useState<string[]>([]);
  const [starshipNames, setStarshipNames] = useState<string[]>([]);
  const [vehicleNames, setVehicleNames] = useState<string[]>([]);

  const fetchData = async (urls: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const names = responses.map(response => response.data.title || response.data.name);
      setter(names);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleFetchData = () => {
    if (!person) return;
  
    type PersonKeys = keyof IPeople;
  
    const fetchDataMappings: { key: PersonKeys; setter: React.Dispatch<React.SetStateAction<string[]>> }[] = [
      { key: 'films', setter: setFilmTitles },
      { key: 'species', setter: setSpeciesNames },
      { key: 'starships', setter: setStarshipNames },
      { key: 'vehicles', setter: setVehicleNames },
    ];
  
    fetchDataMappings.forEach(({ key, setter }) => {
      if (person[key].length > 0) {
        fetchData(person[key] as string[], setter);
      }
    });
  };

  React.useEffect(() => {
    if (visible) {
      const homeSworldFetch = async () => {
        if (person) {
          const response = await axios.get(person.homeworld)
          setPlanetName(response.data.name)
        }
      }
      homeSworldFetch()
      handleFetchData();
    }
  }, [visible, person]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.modalBody}
    >
      <div className={styles.nameHighlight}>
        {person ? person.name : 'Detalhes da Pessoa'}
      </div>
      <div className={styles.personDetails}>
        {person ? (
          <div className={styles.grid}>
            <div className={styles.detail}><span className={styles.label}>Ano de Nascimento:</span> {person.birth_year}</div>
            <div className={styles.detail}><span className={styles.label}>Cor dos Olhos:</span> {person.eye_color}</div>
            <div className={styles.detail}><span className={styles.label}>Gênero:</span> {person.gender}</div>
            <div className={styles.detail}><span className={styles.label}>Cor do Cabelo:</span> {person.hair_color}</div>
            <div className={styles.detail}><span className={styles.label}>Altura:</span> {person.height}</div>
            <div className={styles.detail}><span className={styles.label}>Peso:</span> {person.mass}</div>
            <div className={styles.detail}><span className={styles.label}>Cor da Pele:</span> {person.skin_color}</div>
            <div className={styles.detail}><span className={styles.label}>Planeta Natal:</span> {planetName}</div>

            <div className={styles.detail}>
              <span className={styles.label}>Filmes:</span>
              <div className={styles.column}>{filmTitles.length > 0 ? filmTitles.map((title, index) => (
                <div key={index} className={styles.detail}>{title}</div>
              )) : <p></p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Espécies:</span>
              <div className={styles.column}>{speciesNames.length > 0 ? speciesNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p></p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Naves:</span>
              <div className={styles.column}>{starshipNames.length > 0 ? starshipNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p></p>}</div>
            </div>

            <div className={styles.detail}>
              <span className={styles.label}>Veículos:</span>
              <div className={styles.column}>{vehicleNames.length > 0 ? vehicleNames.map((name, index) => (
                <div key={index} className={styles.detail}>{name}</div>
              )) : <p></p>}</div>
            </div>
          </div>
        ) : (
          <p>Nenhuma pessoa selecionada.</p>
        )}
      </div>
    </Modal>
  );
};

export default PersonModal;
