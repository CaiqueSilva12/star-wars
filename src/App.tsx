import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/login/login';
import Home from './pages/home/home';

const App = () => {
  return (
    <Router>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#FFFF20',
        }
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </ConfigProvider>
    </Router>
  );
};

export default App;
