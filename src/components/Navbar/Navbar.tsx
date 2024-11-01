import React from 'react';
import { Layout, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setName } from '../../redux/slices/userSlice';
import { LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const name = useSelector((state: RootState) => state.user.name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setName(''));
    navigate('/');
  };

  return (
    <Header className={styles.navbar}>
      <div className={styles.welcomeMessage}>
        Bem-vindo, {name}
      </div>
      <Button 
        className={styles.logoutButton} 
        icon={<LogoutOutlined />} 
        onClick={handleLogout}
      >
        Sair
      </Button>
    </Header>
  );
};

export default Navbar;
