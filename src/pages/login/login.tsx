import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

const Login = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsAudioPlaying(true);
        } catch (err) {
          console.log("Autoplay bloqueado. Clique para iniciar.");
        }
      }
    };
    playAudio();
  }, []);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const handleAnimationEnd = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/star-wars-theme.mp3" loop />
      {!isAudioPlaying && (
        <Button
          className={styles.playButton}
          onClick={handlePlayAudio}
          type="primary"
        >
          Iniciar Jornada
        </Button>
      )}
      <div
        className={`${styles.crawl} ${isAudioPlaying ? styles.animateCrawl : ''}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <p>Episódio I</p>
        <p>O Projeto Star Wars.</p>
        <p>Em uma galáxia muito, muito distante,</p>
        <p>as estrelas brilham com histórias antigas.</p>
        <p>O equilíbrio da Força está em jogo,</p>
        <p>e heróis inesperados se levantam.</p>
        <p>Junte-se à luta contra o lado sombrio,</p>
        <p>onde Jedi e Sith duelam em poder.</p>
        <p>Descubra planetas exóticos e fascinantes,</p>
        <p>cada um com suas próprias maravilhas.</p>
        <p>Explore naves icônicas que cruzam o espaço,</p>
        <p>voando entre as estrelas e perigos.</p>
        <p>Personagens lendários aguardam por você,</p>
        <p>prontos para compartilhar suas histórias.</p>
        <p>Prepare-se para a aventura de sua vida,</p>
        <p>onde cada escolha molda seu destino.</p>
        <p>O universo de Star Wars está ao seu alcance,</p>
        <p>cheio de mistérios e heroísmo.</p>
        <p>O que você fará com o seu poder?</p>
        <p>A jornada começa agora!</p>
      </div>
    </div>
  );
};

export default Login;
