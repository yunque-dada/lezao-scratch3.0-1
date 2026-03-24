/**
 * 数据库配置
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lezhao-scratch';
    
    console.log('正在连接MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/\/\/.*:.*@/, '//***:***@')); // 隐藏密码
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB连接成功');
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB连接错误:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB连接已断开');
    });
    
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
    console.error('错误详情:', error);
    
    // 生产环境必须要有数据库
    if (process.env.NODE_ENV === 'production') {
      console.error('生产环境必须连接MongoDB，程序即将退出...');
      // 等待日志输出后再退出
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    }
  }
};

module.exports = connectDB;
