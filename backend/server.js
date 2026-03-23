const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行中' });
});

// 临时测试路由
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API测试成功',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
