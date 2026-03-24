require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/database');
const createIndexes = require('./config/indexes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// 中间件
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库并初始化
connectDB().then(() => {
  createIndexes();
  initializeDefaultAdmin();
});

// 初始化默认管理员用户
async function initializeDefaultAdmin() {
  try {
    const User = require('./models/User');
    
    // 检查是否已有用户
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('🆕 数据库为空，创建默认管理员用户...');
      
      const defaultAdmin = new User({
        username: 'admin',
        email: 'admin@lezhao.com',
        password: 'admin123',
        role: 'admin',
        nickname: '管理员'
      });
      
      await defaultAdmin.save();
      
      console.log('✅ 默认管理员创建成功!');
      console.log('   用户名: admin');
      console.log('   密码: admin123');
      console.log('   角色: admin');
    } else {
      console.log(`📊 数据库已有 ${userCount} 个用户`);
    }
  } catch (error) {
    console.error('❌ 初始化默认管理员失败:', error.message);
  }
}

// 路由
const userRoutes = require('./routes/userRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const courseRoutes = require('./routes/courseRoutes');
const workRoutes = require('./routes/workRoutes');

app.use('/api/auth', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
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

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
