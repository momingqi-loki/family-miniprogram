const express = require('express');
const router = express.Router();
const Family = require('../models/family');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// 获取家庭详情
router.get('/', authMiddleware, async (req, res) => {
  try {
    const familyId = req.user.familyId;
    
    if (!familyId) {
      return res.status(404).json({
        code: 404,
        message: '您还未加入任何家庭'
      });
    }

    const family = await Family.findById(familyId);
    
    if (!family) {
      return res.status(404).json({
        code: 404,
        message: '家庭不存在'
      });
    }

    // 获取成员数量
    const memberCount = await User.countDocuments({ familyId });

    res.json({
      code: 0,
      data: {
        ...family.toObject(),
        memberCount
      }
    });
  } catch (error) {
    console.error('获取家庭详情失败', error);
    res.status(500).json({
      code: 500,
      message: '获取家庭详情失败'
    });
  }
});

// 获取家庭成员列表
router.get('/members', authMiddleware, async (req, res) => {
  try {
    const familyId = req.user.familyId;

    if (!familyId) {
      return res.json({
        code: 0,
        data: []
      });
    }

    const members = await User.find({ familyId })
      .select('nickname avatar role online lastLoginAt');

    res.json({
      code: 0,
      data: members
    });
  } catch (error) {
    console.error('获取家庭成员失败', error);
    res.status(500).json({
      code: 500,
      message: '获取家庭成员失败'
    });
  }
});

// 创建家庭
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    // 检查用户是否已加入家庭
    if (req.user.familyId) {
      return res.json({
        code: 400,
        message: '您已加入家庭'
      });
    }

    // 生成邀请码
    const inviteCode = generateInviteCode();

    // 创建家庭
    const family = new Family({
      name: name || '我的家庭',
      description: description || '',
      inviteCode,
      createdBy: userId
    });
    await family.save();

    // 更新用户信息
    await User.findByIdAndUpdate(userId, {
      familyId: family._id,
      role: 'admin'
    });

    res.json({
      code: 0,
      message: '创建家庭成功',
      data: {
        family,
        inviteCode
      }
    });
  } catch (error) {
    console.error('创建家庭失败', error);
    res.status(500).json({
      code: 500,
      message: '创建家庭失败'
    });
  }
});

// 通过邀请码加入家庭
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    if (!inviteCode) {
      return res.status(400).json({
        code: 400,
        message: '请提供邀请码'
      });
    }

    // 检查用户是否已加入家庭
    if (req.user.familyId) {
      return res.json({
        code: 400,
        message: '您已加入家庭，请先退出当前家庭'
      });
    }

    // 通过邀请码查找家庭
    const family = await Family.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!family) {
      return res.status(404).json({
        code: 404,
        message: '邀请码无效'
      });
    }

    // 更新用户信息
    await User.findByIdAndUpdate(userId, {
      familyId: family._id,
      role: 'member'
    });

    res.json({
      code: 0,
      message: '加入家庭成功',
      data: family
    });
  } catch (error) {
    console.error('加入家庭失败', error);
    res.status(500).json({
      code: 500,
      message: '加入家庭失败'
    });
  }
});

// 获取邀请码
router.get('/invite-code', authMiddleware, async (req, res) => {
  try {
    const familyId = req.user.familyId;

    if (!familyId) {
      return res.status(404).json({
        code: 404,
        message: '您还未加入家庭'
      });
    }

    const family = await Family.findById(familyId);

    res.json({
      code: 0,
      data: {
        inviteCode: family.inviteCode,
        shareUrl: `pages/family/join?code=${family.inviteCode}`
      }
    });
  } catch (error) {
    console.error('获取邀请码失败', error);
    res.status(500).json({
      code: 500,
      message: '获取邀请码失败'
    });
  }
});

// 退出家庭
router.post('/leave', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.familyId) {
      return res.status(400).json({
        code: 400,
        message: '您还未加入家庭'
      });
    }

    // 如果是管理员，检查是否还有其他成员
    if (user.role === 'admin') {
      const memberCount = await User.countDocuments({ 
        familyId: user.familyId,
        _id: { $ne: userId }
      });

      if (memberCount > 0) {
        // 将管理员权限转移给其他成员
        const nextAdmin = await User.findOne({ 
          familyId: user.familyId,
          _id: { $ne: userId }
        });
        if (nextAdmin) {
          nextAdmin.role = 'admin';
          await nextAdmin.save();
        }
      } else {
        // 没有其他成员，删除家庭
        await Family.findByIdAndDelete(user.familyId);
      }
    }

    // 移除用户与家庭的关联
    user.familyId = null;
    user.role = 'member';
    await user.save();

    res.json({
      code: 0,
      message: '已退出家庭'
    });
  } catch (error) {
    console.error('退出家庭失败', error);
    res.status(500).json({
      code: 500,
      message: '退出家庭失败'
    });
  }
});

// 更新家庭信息
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.familyId) {
      return res.status(400).json({
        code: 400,
        message: '您还未加入家庭'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '只有管理员可以修改家庭信息'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const family = await Family.findByIdAndUpdate(
      user.familyId,
      updateData,
      { new: true }
    );

    res.json({
      code: 0,
      message: '更新成功',
      data: family
    });
  } catch (error) {
    console.error('更新家庭信息失败', error);
    res.status(500).json({
      code: 500,
      message: '更新家庭信息失败'
    });
  }
});

// 生成邀请码
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = router;
