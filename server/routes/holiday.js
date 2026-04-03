const express = require('express');
const router = express.Router();
const Holiday = require('../models/holiday');
const User = require('../models/user');

// 获取节日列表
router.get('/', async (req, res) => {
  try {
    const familyId = req.user.familyId;

    const holidays = await Holiday.find({ familyId })
      .populate('createdBy', 'nickname')
      .sort({ date: 1 });

    const holidaysWithEmoji = holidays.map(holiday => ({
      ...holiday._doc,
      emoji: {
        birthday: '🎂',
        anniversary: '💕',
        reunion: '🍽️',
        festival: '🏮'
      }[holiday.type],
      typeText: {
        birthday: '生日',
        anniversary: '纪念日',
        reunion: '家庭聚餐',
        festival: '传统节日'
      }[holiday.type]
    }));

    res.json({
      code: 0,
      message: 'success',
      data: holidaysWithEmoji
    });
  } catch (error) {
    console.error('获取节日列表失败', error);
    res.status(500).json({
      code: 500,
      message: '获取节日列表失败',
      error: error.message
    });
  }
});

// 获取节日详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findById(id)
      .populate('createdBy', 'nickname');

    if (!holiday) {
      return res.status(404).json({
        code: 404,
        message: '节日不存在'
      });
    }

    // 检查权限
    if (holiday.familyId.toString() !== req.user.familyId.toString()) {
      return res.status(403).json({
        code: 403,
        message: '无权限查看此节日'
      });
    }

    res.json({
      code: 0,
      message: 'success',
      data: {
        ...holiday._doc,
        emoji: {
          birthday: '🎂',
          anniversary: '💕',
          reunion: '🍽️',
          festival: '🏮'
        }[holiday.type],
        typeText: {
          birthday: '生日',
          anniversary: '纪念日',
          reunion: '家庭聚餐',
          festival: '传统节日'
        }[holiday.type]
      }
    });
  } catch (error) {
    console.error('获取节日详情失败', error);
    res.status(500).json({
      code: 500,
      message: '获取节日详情失败',
      error: error.message
    });
  }
});

// 创建节日
router.post('/', async (req, res) => {
  try {
    const {
      name,
      date,
      type,
      remindDays,
      suggestions
    } = req.body;

    const familyId = req.user.familyId;
    const createdBy = req.user._id;

    // 验证参数
    if (!name || !date || !type) {
      return res.json({
        code: 400,
        message: '名称、日期和类型不能为空'
      });
    }

    const holiday = new Holiday({
      familyId,
      name,
      date,
      type,
      remindDays: remindDays || 7,
      suggestions,
      createdBy
    });

    await holiday.save();

    res.json({
      code: 0,
      message: '创建节日成功',
      data: holiday
    });
  } catch (error) {
    console.error('创建节日失败', error);
    res.status(500).json({
      code: 500,
      message: '创建节日失败',
      error: error.message
    });
  }
});

// 更新节日
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      date,
      type,
      remindDays,
      suggestions
    } = req.body;

    const holiday = await Holiday.findById(id);

    if (!holiday) {
      return res.status(404).json({
        code: 404,
        message: '节日不存在'
      });
    }

    // 检查权限
    if (holiday.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限修改此节日'
      });
    }

    // 更新节日
    Object.assign(holiday, {
      name: name || holiday.name,
      date: date || holiday.date,
      type: type || holiday.type,
      remindDays: remindDays !== undefined ? remindDays : holiday.remindDays,
      suggestions: suggestions !== undefined ? suggestions : holiday.suggestions
    });

    await holiday.save();

    res.json({
      code: 0,
      message: '更新节日成功',
      data: holiday
    });
  } catch (error) {
    console.error('更新节日失败', error);
    res.status(500).json({
      code: 500,
      message: '更新节日失败',
      error: error.message
    });
  }
});

// 删除节日
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findById(id);

    if (!holiday) {
      return res.status(404).json({
        code: 404,
        message: '节日不存在'
      });
    }

    // 检查权限
    if (holiday.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此节日'
      });
    }

    await Holiday.findByIdAndDelete(id);

    res.json({
      code: 0,
      message: '删除节日成功'
    });
  } catch (error) {
    console.error('删除节日失败', error);
    res.status(500).json({
      code: 500,
      message: '删除节日失败',
      error: error.message
    });
  }
});

module.exports = router;
