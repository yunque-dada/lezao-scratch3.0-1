/**
 * Scratch作品编辑器
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Empty } from 'antd';

const { Title } = Typography;

const WorkEditor = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Scratch编辑器</Title>
      <Card>
        <Empty description="Scratch编辑器集成开发中..." />
        <div style={{ marginTop: 24, textAlign: 'center', padding: 100, background: '#f5f5f5' }}>
          <Title level={4}>Scratch编辑器区域</Title>
          <p>作品ID: {id || '新建作品'}</p>
        </div>
      </Card>
    </div>
  );
};

export default WorkEditor;
