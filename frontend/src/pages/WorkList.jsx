/**
 * 作品列表页
 */
import React from 'react';
import { Typography, Empty, Button, Card, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const WorkList = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>我的作品</Title>
        <Link to="/works/new">
          <Button type="primary" icon={<PlusOutlined />}>
            创建作品
          </Button>
        </Link>
      </div>
      <Empty description="暂无作品，开始创作吧！">
        <Link to="/works/new">
          <Button type="primary">创建第一个作品</Button>
        </Link>
      </Empty>
    </div>
  );
};

export default WorkList;
