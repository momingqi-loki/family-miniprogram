const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Family = require('../models/family');
const jwt = require('jsonwebtoken');

// 微信登录
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;

    // TODO: 调用微信API获取openid和session_key
    // const wxResult = await getWechatUserInfo(code);
    // const { openid, session_key } = wxResult;

    // 临时模拟openid
    const openid = 'test_openid_' + Date.now();

    // 查找或创建用户
    let user = await User.findOne({ openid });

    if (!user) {
      // 创建新用户
      user = new User({
        openid,
        nickname: '用户' + Math.floor(Math.random() * 1000),
        role: 'admin' // 第一个用户默认为管理员
      });
      await user.save();
    }

    // 生成token
    const token = jwt.sign(
      { userId: user._id, familyId: user.familyId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role,
          familyId: user.familyId
        }
      }
    });
  } catch (error) {
    console.error('登录失败', error);
    res.status(500).json({
      code: 500,
      message: '登录失败',
      error: error.message
    });
  }
});

// 更新用户信息
router.put('/profile', async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    user.nickname = nickname || user.nickname;
    user.avatar = avatar || user.avatar;

    await user.save();

    res.json({
      code: 0,
      message: '更新用户信息成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户信息失败', error);
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败',
      error: error.message
    });
  }
});

// 获取用户信息
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('familyId');

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 0,
      message: 'success',
      data: user
    });
  } catch (error) {
    console.error('获取用户信息失败', error);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

// 更新在线状态
router.put('/online', async (req, res) => {
  try {
    const userId = req.user._id;
    const { online } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    user.online = online;
    user.lastLoginAt = new Date();

    await user.save();

    res.json({
      code: 0,
      message: '更新在线状态成功',
      data: user
    });
  } catch (error) {
    console.error('更新在线状态失败', error);
    res.status(500).json({
      code: 500,
      message: '更新在线状态失败',
      error: error.message
    });
  }
});

module.exports = router;
