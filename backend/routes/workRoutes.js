/**
 * 作品路由
 */
const express = require('express');
const router = express.Router();
const Work = require('../models/Work');
const { auth } = require('../middleware/auth');

// 获取作品列表
router.get('/', async (req, res) => {
  try {
    const { course, user, status } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (user) filter.user = user;
    if (status) filter.status = status;
    
    const works = await Work.find(filter)
      .populate('user', 'username nickname avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: '获取作品列表失败', error: error.message });
  }
});

// 获取作品详情
router.get('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)
      .populate('user', 'username nickname avatar')
      .populate('course', 'title')
      .populate('grades.teacher', 'username nickname')
      .populate('comments.user', 'username nickname avatar');
    
    if (!work) {
      return res.status(404).json({ message: '作品不存在' });
    }
    
    res.json(work);
  } catch (error) {
    res.status(500).json({ message: '获取作品详情失败', error: error.message });
  }
});

// 提交作品
router.post('/', auth, async (req, res) => {
  try {
    const { title, fileUrl, coverUrl, course, chapter } = req.body;
    
    const work = new Work({
      title,
      fileUrl,
      coverUrl,
      course,
      chapter,
      user: req.user.userId
    });
    
    await work.save();
    
    res.status(201).json({
      message: '提交成功',
      work
    });
  } catch (error) {
    res.status(500).json({ message: '提交作品失败', error: error.message });
  }
});

// 更新作品
router.put('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: '作品不存在' });
    }
    
    // 检查权限
    if (work.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }
    
    const { title, fileUrl, coverUrl } = req.body;
    if (title) work.title = title;
    if (fileUrl) work.fileUrl = fileUrl;
    if (coverUrl) work.coverUrl = coverUrl;
    
    await work.save();
    
    res.json({ message: '更新成功', work });
  } catch (error) {
    res.status(500).json({ message: '更新作品失败', error: error.message });
  }
});

// 删除作品
router.delete('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: '作品不存在' });
    }
    
    // 检查权限
    if (work.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }
    
    await work.deleteOne();
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除作品失败', error: error.message });
  }
});

// 批改作品
router.post('/:id/grade', auth, async (req, res) => {
  try {
    // 只有老师和管理员可以批改
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '只有老师可以批改作品' });
    }
    
    const work = await Work.findById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: '作品不存在' });
    }
    
    const { score, comment } = req.body;
    
    work.grades.push({
      teacher: req.user.userId,
      score,
      comment
    });
    
    work.status = 'graded';
    work.score = score;
    
    await work.save();
    
    res.json({ message: '批改成功', work });
  } catch (error) {
    res.status(500).json({ message: '批改作品失败', error: error.message });
  }
});

// 添加评论
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: '作品不存在' });
    }
    
    const { content } = req.body;
    
    work.comments.push({
      user: req.user.userId,
      content
    });
    
    await work.save();
    
    res.json({ message: '评论成功', work });
  } catch (error) {
    res.status(500).json({ message: '评论失败', error: error.message });
  }
});

module.exports = router;
