/**
 * 数据库索引配置
 * 用于优化查询性能
 */
const mongoose = require('mongoose');

const createIndexes = async () => {
  try {
    // 用户模型索引
    await mongoose.model('User').createIndexes([
      { username: 1 },
      { email: 1 },
      { role: 1 }
    ]);
    console.log('User indexes created');

    // 课程模型索引
    await mongoose.model('Course').createIndexes([
      { teacher: 1 },
      { status: 1 },
      { createdAt: -1 }
    ]);
    console.log('Course indexes created');

    // 作品模型索引
    await mongoose.model('Work').createIndexes([
      { user: 1 },
      { course: 1 },
      { status: 1 },
      { createdAt: -1 }
    ]);
    console.log('Work indexes created');

    console.log('All indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = createIndexes;
