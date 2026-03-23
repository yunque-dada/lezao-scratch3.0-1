/**
 * 课程路由
 */
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// 获取课程列表
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const courses = await Course.find(filter)
      .populate('teacher', 'username nickname avatar')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: '获取课程列表失败', error: error.message });
  }
});

// 获取课程详情
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'username nickname avatar');
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: '获取课程详情失败', error: error.message });
  }
});

// 创建课程
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, cover } = req.body;
    
    const course = new Course({
      title,
      description,
      cover,
      teacher: req.user.userId
    });
    
    await course.save();
    
    res.status(201).json({
      message: '创建成功',
      course
    });
  } catch (error) {
    res.status(500).json({ message: '创建课程失败', error: error.message });
  }
});

// 更新课程
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    // 检查权限
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }
    
    const { title, description, cover, status } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (cover) course.cover = cover;
    if (status) course.status = status;
    
    await course.save();
    
    res.json({ message: '更新成功', course });
  } catch (error) {
    res.status(500).json({ message: '更新课程失败', error: error.message });
  }
});

// 删除课程
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    // 检查权限
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }
    
    await course.deleteOne();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除课程失败', error: error.message });
  }
});

module.exports = router;
