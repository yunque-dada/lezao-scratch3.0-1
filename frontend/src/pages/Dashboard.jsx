/**
 * 首页/Dashboard
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { BookOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>欢迎回来，{user?.nickname || user?.username || '用户'}！</Title>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="我的课程"
              value={0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="我的作品"
              value={0}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="账户类型"
              value={user?.role === 'teacher' ? '老师' : '学生'}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="快速开始">
            <p>• 浏览课程中心开始学习</p>
            <p>• 创建您的第一个Scratch作品</p>
            <p>• 查看优秀作品激发灵感</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
