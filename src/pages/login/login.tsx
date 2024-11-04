import { useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import LoginForm from './components/LoginForm/LoginForm';

const Login = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const navigate = useNavigate();

  const handlePlayAudio = async () => {
    if (audioRef.current && !isAudioPlaying) {
      try {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } catch (err) {
        console.log("Autoplay bloqueado. Clique para iniciar.");
      }
    }
  };

  const handleAnimationEnd = () => {
    setShowStartButton(true);
  };

  const handleNameSubmit = async (name: string) => {
    Modal.success({
      content: `Bem-vindo, ${name}!`,
      centered: true,
      onOk: async () => {
        setIsFormVisible(false);
        setIsAnimationPlaying(true);
        await handlePlayAudio();
      },
    });
  };

  const handleStartJourney = () => {
    navigate('/home');
  };

  const handleSkipAnimation = () => {
    setIsAnimationPlaying(false);
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/star-wars-theme.mp3" loop />
      {isFormVisible &&
        <div className={styles.loginFormContainer}>
          <h2 className={styles.title}>Star Wars</h2>
          <LoginForm onSubmit={handleNameSubmit} />
        </div>
      }
      {isAnimationPlaying && (
        <>
          <div
            className={styles.animateCrawl}
            onAnimationEnd={handleAnimationEnd}
          >
            <p>Bem-vindo à sua aventura no universo de Star Wars!</p>
            <p>Aqui, você encontrará informações incríveis sobre personagens, planetas e naves.</p>
            <p>Prepare-se para conhecer os heróis e vilões que moldaram a galáxia.</p>
            <p>Descubra tudo sobre os Jedi e os Sith, suas histórias e poderes.</p>
            <p>Navegue entre as tabelas para aprender sobre os planetas, desde os desertos de Tatooine até os mundos gelados de Hoth.</p>
            <p>Saiba mais sobre as naves que cruzam o espaço, como a famosa Millennium Falcon.</p>
            <p>Explore os detalhes dos filmes e as tramas emocionantes que capturaram milhões de fãs.</p>
            <p>Cada clique traz novos conhecimentos e curiosidades sobre esse universo fascinante.</p>
            <p>Você está prestes a mergulhar em um mar de informações que vai fazer você sentir como um verdadeiro fã de Star Wars.</p>
            <p>Vamos começar essa jornada e descobrir tudo o que Star Wars tem a oferecer!</p>
            <p>Que a Força esteja com você enquanto você navega por essas informações!</p>
          </div>
          <Button 
            type="default" 
            onClick={handleSkipAnimation} 
            className={styles.skipButton}
          >
            Pular Animação
          </Button>
        </>
      )}
      {showStartButton && (
        <Button type="primary" onClick={handleStartJourney} className={styles.startButton}>
          Iniciar a Jornada
        </Button>
      )}
    </div>
  );
};

export default Login;
