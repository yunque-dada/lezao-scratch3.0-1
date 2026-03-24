/**
 * 作品列表页
 */
import React from 'react';
import { Typography, Card, Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const WorkList = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>我的作品</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          创建作品
        </Button>
      </div>
      <Empty description="暂无作品，开始创作吧！" />
    </div>
  );
};

export default WorkList;
