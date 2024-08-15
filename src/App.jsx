import { Layout, Menu, theme } from 'antd';
import { Link, Routes, Route } from 'react-router-dom';
import Homepage from './assets/components/Homepage';
import Rainfall from './assets/components/Rainfall';
import Weather2hrs from './assets/components/Weather2hrs';
import UVIndex from './assets/components/UVIndex';

const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
};

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}/>
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
          </Menu>
      </Sider>
      <Layout
        style={{
          marginInlineStart: 200,
        }}
      >
       
    
      {/* <Layout> */}
      <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <h1>Sunblock or Umbrella?</h1> 
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
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
