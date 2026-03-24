/**
 * 课程列表页
 */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>课程中心</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          创建课程
        </Button>
      </div>

      {courses.length === 0 ? (
        <Empty description="暂无课程" />
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map(course => (
            <Col key={course._id} span={8}>
              <Link to={`/courses/${course._id}`}>
                <Card hoverable>
                  <img src={course.cover || '/placeholder.jpg'} alt={course.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  <Title level={4}>{course.title}</Title>
                  <Text>{course.description}</Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CourseList;
