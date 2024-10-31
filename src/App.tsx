import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import { ConfigProvider } from 'antd';

const App = () => {
  return (
    <Router>
      <ConfigProvider direction='rtl' theme={{
        token: {
          colorPrimary: '#FFFF20',
        }
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </ConfigProvider>
    </Router>
  );
};

export default App;
