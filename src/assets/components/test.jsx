import { Layout, Menu } from 'antd';
import { Link, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Rainfall from './Rainfall';
import Weather2hrs from './Weather2hrs';
import UVIndex from './UVIndex';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <Layout>
      <Sider>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/Rainfall">Any Rain?</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/Weather2hrs">2 hrs forecast</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/UVIndex">UV Index</Link>
          </Menu.Item>
          {/* Add other navigation items here */}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', textAlign: 'center' }}>
          <h1>Sunblock or Umbrella?</h1> 
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/Rainfall" element={<Rainfall />} />
              <Route path="/Weather2hrs" element={<Weather2hrs />} />
              <Route path="/UVIndex" element={<UVIndex />} />
              {/* Add other routes here */}
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MHS's App ©{new Date().getFullYear()} Created by MHS
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
