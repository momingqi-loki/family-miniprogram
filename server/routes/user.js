const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Family = require('../models/family');
const jwt = require('jsonwebtoken');
const https = require('https');

// 微信登录
router.post('/login', async (req, res) => {
  try {
    const { code, loginType } = req.body;
    let openid;

    // 根据登录类型处理
    if (loginType === 'wechat' && code) {
      // 调用微信 API 获取 openid
      const wxConfig = {
        appid: process.env.WX_APPID || '',
        secret: process.env.WX_SECRET || '',
        js_code: code,
        grant_type: 'authorization_code'
      };

      // 如果没有配置微信参数，使用模拟 openid
      if (!wxConfig.appid || !wxConfig.secret) {
        console.log('微信配置未设置，使用模拟 openid');
        openid = 'test_openid_' + Date.now();
      } else {
        // 调用微信接口
        try {
          const wxResult = await callWxAPI(wxConfig);
          if (wxResult.errcode) {
            return res.status(400).json({
              code: 400,
              message: '微信登录失败：' + wxResult.errmsg
            });
          }
          openid = wxResult.openid;
        } catch (err) {
          console.error('微信 API 调用失败', err);
          openid = 'test_openid_' + Date.now();
        }
      }
    } else if (loginType === 'phone' && req.body.phone) {
      // 手机号登录（需要先通过微信获取手机号）
      const { phone } = req.body;
      openid = 'phone_' + phone; // 简化处理
    } else {
      // 默认使用模拟 openid
      openid = 'guest_' + Date.now();
    }

    // 查找或创建用户
    let user = await User.findOne({ openid });

    if (!user) {
      // 创建新用户
      user = new User({
        openid,
        nickname: '用户' + Math.floor(Math.random() * 1000),
        role: 'admin',
        phone: req.body.phone || ''
      });
      await user.save();
    }

    // 更新登录时间
    user.lastLoginAt = new Date();
    user.online = true;
    await user.save();

    // 生成 token
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
        user: {
          _id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role,
          familyId: user.familyId,
          phone: user.phone
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

// 获取用户信息
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-openid');

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    // 获取家庭信息
    let familyInfo = null;
    if (user.familyId) {
      familyInfo = await Family.findById(user.familyId);
    }

    res.json({
      code: 0,
      data: {
        ...user.toObject(),
        familyInfo
      }
    });
  } catch (error) {
    console.error('获取用户信息失败', error);
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败'
    });
  }
});

// 更新用户信息
router.put('/profile', async (req, res) => {
  try {
    const { nickname, avatar, phone } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (avatar) updateData.avatar = avatar;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    res.json({
      code: 0,
      message: '更新成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户信息失败', error);
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败'
    });
  }
});

// 退出登录
router.post('/logout', async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { online: false });

    res.json({
      code: 0,
      message: '退出成功'
    });
  } catch (error) {
    console.error('退出登录失败', error);
    res.status(500).json({
      code: 500,
      message: '退出登录失败'
    });
  }
});

// 调用微信 API
function callWxAPI(params) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${params.appid}&secret=${params.secret}&js_code=${params.js_code}&grant_type=${params.grant_type}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

module.exports = router;
