/**
 * 课程管理页面 - 老师/管理�? */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_CONFIG } from '../utils/apiConfig';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Popconfirm, Space, Tag, Card, Row, Col 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const CourseManagement = () => {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const canManage = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const fetchCourses = async (page = 1) => {
    if (!canManage) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://lezao-houduan.up.railway.app/api/courses?page=${page}&limit=10&status=all`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setCourses(data.list || []);
      setPagination({ ...pagination, current: page, total: data.total });
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) {
      fetchCourses();
    }
  }, [canManage, token]);

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://lezao-houduan.up.railway.app/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('删除成功');
      fetchCourses(pagination.current);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const url = editingCourse 
        ? `https://lezao-houduan.up.railway.app/api/courses/${editingCourse._id}`
        : 'https://lezao-houduan.up.railway.app/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      message.success(editingCourse ? '更新成功' : '创建成功');
      setModalVisible(false);
      fetchCourses(pagination.current);
    } catch (error) {
      message.error(editingCourse ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    { title: '课程名称', dataIndex: 'title', key: 'title', width: 200 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: '状�?, 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发�? : '草稿'}
        </Tag>
      )
    },
    { title: '章节�?, dataIndex: 'chapters', key: 'chapters', 
      render: (chs) => chs?.length || 0 
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', 
      render: (text) => new Date(text).toLocaleDateString() 
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} href={`/courses/${record._id}`} target="_blank">
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此课程？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (!canManage) {
    return <div>您没有权限访问此页面</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>课程管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          创建课程
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page) => fetchCourses(page)
        }}
      />

      <Modal
        title={editingCourse ? '编辑课程' : '创建课程'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="课程名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="课程描述">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="cover" label="封面图片URL">
            <Input />
          </Form.Item>
          {editingCourse && (
            <Form.Item name="status" label="状�?>
              <Select>
                <Option value="draft">草稿</Option>
                <Option value="published">已发�?/Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingCourse ? '更新' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
