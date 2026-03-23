const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
connectDB();

// 路由
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const workRoutes = require('./routes/workRoutes');

app.use('/api/auth', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/works', workRoutes);

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
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
