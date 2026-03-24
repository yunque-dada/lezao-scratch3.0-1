/**
 * 用户路由
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, generateToken } = require('../middleware/auth');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, nickname } = req.body;
    
    // 检查用户是否存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }
    
    // 创建用户
    const user = new User({
      username,
      email,
      password,
      nickname: nickname || username
    });
    
    await user.save();
    
    const token = generateToken(user._id, user.role);
    
    res.status(201).json({
      message: '注册成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: '注册失败', error: error.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    const token = generateToken(user._id, user.role);
    
    res.json({
      message: '登录成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

// 获取当前用户信息
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
});

// 更新用户信息
router.put('/profile', auth, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (nickname) user.nickname = nickname;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    res.json({ message: '更新成功', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: '更新失败', error: error.message });
  }
});

// 刷新令牌
router.post('/refresh-token', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    const token = generateToken(user._id, user.role);
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '刷新令牌失败', error: error.message });
  }
});

module.exports = router;
