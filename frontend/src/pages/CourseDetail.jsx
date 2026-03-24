/**
 * 课程详情页
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Empty } from 'antd';

const { Title, Text } = Typography;

const CourseDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>课程详情</Title>
      <Card>
        <Text>课程ID: {id}</Text>
        <Empty description="课程内容开发中..." style={{ marginTop: 24 }} />
      </Card>
    </div>
  );
};

export default CourseDetail;
