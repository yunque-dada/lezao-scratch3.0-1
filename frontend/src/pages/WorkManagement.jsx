/**
 * 作品管理页面 - 老师批改
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Table, Button, Modal, Form, Input, Rate, 
  message, Card, Row, Col, Tag, Space, Tabs 
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { TabPane } = Tabs;

const WorkManagement = () => {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [gradeVisible, setGradeVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [form] = Form.useForm();
  const [gradeForm] = Form.useForm();

  const canGrade = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const url = canGrade 
        ? 'https://lezao-houduan.up.railway.app/api/works?status=all'
        : `https://lezao-houduan.up.railway.app/api/works?user=${currentUser?._id}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWorks(Array.isArray(data) ? data : data.list || []);
    } catch (error) {
      message.error('获取作品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [canGrade, token, currentUser]);

  const handleView = async (record) => {
    try {
      const response = await fetch(`https://lezao-houduan.up.railway.app/api/works/${record._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedWork(data);
      setDetailVisible(true);
    } catch (error) {
      message.error('获取作品详情失败');
    }
  };

  const handleGrade = (record) => {
    setSelectedWork(record);
    gradeForm.setFieldsValue({ score: record.score || 0, comment: '' });
    setGradeVisible(true);
  };

  const handleGradeSubmit = async (values) => {
    try {
      await fetch(`https://lezao-houduan.up.railway.app/api/works/${selectedWork._id}/grade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      message.success('批改成功');
      setGradeVisible(false);
      fetchWorks();
    } catch (error) {
      message.error('批改失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://lezao-houduan.up.railway.app/api/works/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('删除成功');
      fetchWorks();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '作品名称', dataIndex: 'title', key: 'title', width: 200 },
    { title: '作者', dataIndex: 'user', key: 'user', 
      render: (user) => user?.nickname || user?.username 
    },
    { title: '课程', dataIndex: 'course', key: 'course',
      render: (course) => course?.title || '-'
    },
    { 
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status) => (
        <Tag color={status === 'graded' ? 'green' : 'orange'}>
          {status === 'graded' ? '已批改' : '待批改'}
        </Tag>
      )
    },
    { title: '得分', dataIndex: 'score', key: 'score', render: (s) => s || '-' },
    { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          {canGrade && (
            <Button type="link" icon={<EditOutlined />} onClick={() => handleGrade(record)}>
              批改
            </Button>
          )}
          {(record.user?._id === currentUser?._id || canGrade) && (
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>作品管理</h2>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="全部作品" key="1">
          <Table
            columns={columns}
            dataSource={works}
            rowKey="_id"
            loading={loading}
          />
        </TabPane>
      </Tabs>

      {/* 作品详情弹窗 */}
      <Modal
        title="作品详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedWork && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="基本信息">
                  <p><strong>作品名称：</strong>{selectedWork.title}</p>
                  <p><strong>作者：</strong>{selectedWork.user?.nickname || selectedWork.user?.username}</p>
                  <p><strong>课程：</strong>{selectedWork.course?.title || '-'}</p>
                  <p><strong>状态：</strong>
                    <Tag color={selectedWork.status === 'graded' ? 'green' : 'orange'}>
                      {selectedWork.status === 'graded' ? '已批改' : '待批改'}
                    </Tag>
                  </p>
                  <p><strong>得分：</strong>{selectedWork.score || '-'}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="作品预览">
                  {selectedWork.coverUrl ? (
                    <img src={selectedWork.coverUrl} alt={selectedWork.title} style={{ width: '100%' }} />
                  ) : (
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                      暂无预览
                    </div>
                  )}
                  <Button type="primary" href={`/works/${selectedWork._id}`} style={{ marginTop: 16 }} block>
                    在编辑器中打开
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 批改弹窗 */}
      <Modal
        title="批改作品"
        open={gradeVisible}
        onCancel={() => setGradeVisible(false)}
        footer={null}
      >
        <Form form={gradeForm} layout="vertical" onFinish={handleGradeSubmit}>
          <Form.Item name="score" label="评分">
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="评语">
            <TextArea rows={4} placeholder="请输入评语.." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交批改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkManagement;