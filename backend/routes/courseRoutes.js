/**
 * 课程路由 - 完整版
 */
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// 获取课程列表（公开）
router.get('/', async (req, res) => {
  try {
    const { status = 'published', page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    
    const courses = await Course.find(filter)
      .populate('teacher', 'username nickname avatar')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Course.countDocuments(filter);

    res.json({ list: courses, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: '获取课程列表失败', error: error.message });
  }
});

// 获取课程详情（公开）
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

// 创建课程（老师/管理员）
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有老师可以创建课程' });
    }

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

// === 章节管理 ===

// 添加章节
router.post('/:id/chapters', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const { title, order } = req.body;
    course.chapters.push({ title, order: order || course.chapters.length + 1 });
    await course.save();
    
    res.status(201).json({ message: '章节添加成功', course });
  } catch (error) {
    res.status(500).json({ message: '添加章节失败', error: error.message });
  }
});

// 更新章节
router.put('/:id/chapters/:chapterId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const chapter = course.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ message: '章节不存在' });
    }

    const { title, order } = req.body;
    if (title) chapter.title = title;
    if (order) chapter.order = order;
    await course.save();
    
    res.json({ message: '章节更新成功', course });
  } catch (error) {
    res.status(500).json({ message: '更新章节失败', error: error.message });
  }
});

// 删除章节
router.delete('/:id/chapters/:chapterId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    course.chapters.pull(req.params.chapterId);
    await course.save();
    
    res.json({ message: '章节删除成功', course });
  } catch (error) {
    res.status(500).json({ message: '删除章节失败', error: error.message });
  }
});

// === 内容管理 ===

// 添加内容
router.post('/:id/contents', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const { title, type, content, chapterId, order } = req.body;
    course.contents.push({ 
      title, 
      type, // scratch/document/video
      content, 
      chapter: chapterId,
      order: order || course.contents.length + 1 
    });
    await course.save();
    
    res.status(201).json({ message: '内容添加成功', course });
  } catch (error) {
    res.status(500).json({ message: '添加内容失败', error: error.message });
  }
});

// 更新内容
router.put('/:id/contents/:contentId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const contentItem = course.contents.id(req.params.contentId);
    if (!contentItem) {
      return res.status(404).json({ message: '内容不存在' });
    }

    const { title, type, content, chapterId, order } = req.body;
    if (title) contentItem.title = title;
    if (type) contentItem.type = type;
    if (content) contentItem.content = content;
    if (chapterId) contentItem.chapter = chapterId;
    if (order) contentItem.order = order;
    await course.save();
    
    res.json({ message: '内容更新成功', course });
  } catch (error) {
    res.status(500).json({ message: '更新内容失败', error: error.message });
  }
});

// 删除内容
router.delete('/:id/contents/:contentId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    if (course.teacher.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    course.contents.pull(req.params.contentId);
    await course.save();
    
    res.json({ message: '内容删除成功', course });
  } catch (error) {
    res.status(500).json({ message: '删除内容失败', error: error.message });
  }
});

module.exports = router;
