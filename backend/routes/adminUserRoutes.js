/**
 * 用户路由 - 管理员版
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// 获取用户列表（管理员）
router.get('/', auth, async (req, res) => {
  try {
    // 只有管理员可以查看所有用户
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const { page = 1, limit = 10, role, keyword } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (keyword) {
      filter.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { nickname: { $regex: keyword, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      list: users,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
});

// 获取用户详情
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '获取用户详情失败', error: error.message });
  }
});

// 创建用户（管理员）
router.post('/', auth, async (req, res) => {
  try {
    // 只有管理员可以创建用户
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const { username, email, password, role, nickname } = req.body;

    // 检查用户是否存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'student',
      nickname: nickname || username
    });

    await user.save();

    res.status(201).json({
      message: '创建成功',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: '创建用户失败', error: error.message });
  }
});

// 更新用户
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查权限：管理员可以修改任何用户，用户只能修改自己
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: '没有权限' });
    }

    const { nickname, avatar, role } = req.body;

    if (nickname) user.nickname = nickname;
    if (avatar) user.avatar = avatar;
    // 只有管理员可以修改角色
    if (role && req.user.role === 'admin') user.role = role;

    await user.save();

    res.json({ message: '更新成功', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: '更新用户失败', error: error.message });
  }
});

// 删除用户（管理员）
router.delete('/:id', auth, async (req, res) => {
  try {
    // 只有管理员可以删除用户
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    // 不能删除自己
    if (req.user.userId === req.params.id) {
      return res.status(400).json({ message: '不能删除自己的账户' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    await user.deleteOne();

    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除用户失败', error: error.message });
  }
});

// 重置密码（管理员）
router.post('/:id/reset-password', auth, async (req, res) => {
  try {
    // 只有管理员可以重置密码
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限' });
    }

    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: '密码长度至少6位' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: '密码重置成功' });
  } catch (error) {
    res.status(500).json({ message: '重置密码失败', error: error.message });
  }
});

module.exports = router;
