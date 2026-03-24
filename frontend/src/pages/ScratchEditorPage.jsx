/**
 * Scratch作品编辑器页�? */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, message, Spin, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ScratchEditor from '../components/ScratchEditor';

const ScratchEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 加载项目数据
    const loadProject = async () => {
      if (id && id !== 'new') {
        try {
          const response = await fetch(`https://lezao-houduan.up.railway.app/api/works/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.fileUrl) {
            // 加载项目文件
            // window.scratch.loadProject(data.fileUrl, callback);
          }
        } catch (error) {
          message.error('加载作品失败');
        }
      }
      setLoading(false);
    };

    loadProject();
  }, [id, token]);

  const handleSave = async (projectData) => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    setSaving(true);
    try {
      const workData = {
        title: projectData.projectName || '未命名作�?,
        fileUrl: projectData.file || '',
        coverUrl: projectData.cover || '',
        course: null,
        chapter: null
      };

      const url = id && id !== 'new' 
        ? `https://lezao-houduan.up.railway.app/api/works/${id}`
        : 'https://lezao-houduan.up.railway.app/api/works';
      
      const method = id && id !== 'new' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workData)
      });

      const data = await response.json();

      if (response.ok) {
        message.success('保存成功');
        if (!id || id === 'new') {
          navigate(`/works/${data.work?._id}`);
        }
      } else {
        message.error(data.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具�?*/}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/works')}>
            返回
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            loading={saving}
            onClick={() => {
              // 触发保存
              const event = new CustomEvent('scratch-save');
              window.dispatchEvent(event);
            }}
          >
            {saving ? '保存�?..' : '保存作品'}
          </Button>
        </Space>
      </Card>

      {/* Scratch编辑器区�?*/}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ScratchEditor
          projectId={id}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ScratchEditorPage;
