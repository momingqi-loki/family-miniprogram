const express = require('express');
const router = express.Router();
const Family = require('../models/family');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// 获取家庭成员列表
router.get('/members', authMiddleware, async (req, res) => {
  try {
    const familyId = req.user.familyId;

    const members = await User.find({ familyId })
      .select('nickname avatar role online lastLoginAt');

    res.json({
      code: 0,
      message: 'success',
      data: members
    });
  } catch (error) {
    console.error('获取家庭成员失败', error);
    res.status(500).json({
      code: 500,
      message: '获取家庭成员失败',
      error: error.message
    });
  }
});

// 创建家庭
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    // 检查用户是否已加入家庭
    if (req.user.familyId) {
      return res.json({
        code: 400,
        message: '您已加入家庭'
      });
    }

    // 创建家庭
    const family = new Family({
      name
    });
    await family.save();

    // 更新用户信息
    const user = await User.findById(userId);
    user.familyId = family._id;
    user.role = 'admin';
    await user.save();

    res.json({
      code: 0,
      message: '创建家庭成功',
      data: family
    });
  } catch (error) {
    console.error('创建家庭失败', error);
    res.status(500).json({
      code: 500,
      message: '创建家庭失败',
      error: error.message
    });
  }
});

// 邀请成员加入家庭
router.post('/invite', authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    // TODO: 实现邀请码生成和验证逻辑
    // 这里可以使用邀请码或者微信分享链接的方式

    res.json({
      code: 0,
      message: '邀请功能待实现'
    });
  } catch (error) {
    console.error('邀请成员失败', error);
    res.status(500).json({
      code: 500,
      message: '邀请成员失败',
      error: error.message
    });
  }
});

// 加入家庭
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { familyId } = req.body;
    const userId = req.user._id;

    // 检查家庭是否存在
    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        code: 404,
        message: '家庭不存在'
      });
    }

    // 更新用户信息
    const user = await User.findById(userId);
    user.familyId = familyId;
    user.role = 'member';
    await user.save();

    res.json({
      code: 0,
      message: '加入家庭成功',
      data: family
    });
  } catch (error) {
    console.error('加入家庭失败', error);
    res.status(500).json({
      code: 500,
      message: '加入家庭失败',
      error: error.message
    });
  }
});

module.exports = router;
