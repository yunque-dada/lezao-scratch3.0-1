/**
 * 主布局组件
 */
import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { 
  DashboardOutlined, 
  BookOutlined, 
  FileOutlined, 
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children, collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout
      }
    ]
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">首页</Link>
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: <Link to="/courses">课程中心</Link>
    },
    {
      key: '/works',
      icon: <FileOutlined />,
      label: <Link to="/works">我的作品</Link>
    },
    ...(isAdmin ? [{
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">用户管理</Link>
    }] : [])
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) onCollapse(true);
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 16 : 20,
          fontWeight: 'bold'
        }}>
          {collapsed ? '乐造' : '乐造Scratch3.0'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} src={user?.avatar} />
              <span>{user?.nickname || user?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, overflow: 'initial' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
