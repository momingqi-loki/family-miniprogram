const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');

// 获取今日日程
router.get('/today', async (req, res) => {
  try {
    const { date } = req.query;
    const familyId = req.user.familyId;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
      familyId,
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('participants', 'nickname')
      .populate('createdBy', 'nickname')
      .sort({ startTime: 1 });

    res.json({
      code: 0,
      message: 'success',
      data: events
    });
  } catch (error) {
    console.error('获取今日日程失败', error);
    res.status(500).json({
      code: 500,
      message: '获取今日日程失败',
      error: error.message
    });
  }
});

// 创建日程
router.post('/', async (req, res) => {
  try {
    const {
      title,
      startTime,
      endTime,
      repeatType,
      participants,
      location,
      remindTime,
      remark
    } = req.body;

    const familyId = req.user.familyId;
    const createdBy = req.user._id;

    // 冲突检测
    const conflictEvents = await Event.find({
      familyId,
      participants: { $in: participants },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (conflictEvents.length > 0) {
      return res.json({
        code: 400,
        message: '日程时间冲突',
        conflicts: conflictEvents
      });
    }

    const event = new Event({
      familyId,
      title,
      startTime,
      endTime,
      repeatType,
      participants,
      location,
      remindTime,
      remark,
      createdBy
    });

    await event.save();

    res.json({
      code: 0,
      message: '创建日程成功',
      data: event
    });
  } catch (error) {
    console.error('创建日程失败', error);
    res.status(500).json({
      code: 500,
      message: '创建日程失败',
      error: error.message
    });
  }
});

// 获取日历视图
router.get('/calendar', async (req, res) => {
  try {
    const { year, month } = req.query;
    const familyId = req.user.familyId;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const events = await Event.find({
      familyId,
      startTime: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('participants', 'nickname')
      .sort({ startTime: 1 });

    res.json({
      code: 0,
      message: 'success',
      data: events
    });
  } catch (error) {
    console.error('获取日历视图失败', error);
    res.status(500).json({
      code: 500,
      message: '获取日历视图失败',
      error: error.message
    });
  }
});

// 更新日程
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, repeatType, participants, location, remindTime, remark } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: '日程不存在'
      });
    }

    // 检查权限
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限修改此日程'
      });
    }

    // 更新日程
    Object.assign(event, {
      title,
      startTime,
      endTime,
      repeatType,
      participants,
      location,
      remindTime,
      remark
    });

    await event.save();

    res.json({
      code: 0,
      message: '更新日程成功',
      data: event
    });
  } catch (error) {
    console.error('更新日程失败', error);
    res.status(500).json({
      code: 500,
      message: '更新日程失败',
      error: error.message
    });
  }
});

// 删除日程
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        code: 404,
        message: '日程不存在'
      });
    }

    // 检查权限
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此日程'
      });
    }

    await Event.findByIdAndDelete(id);

    res.json({
      code: 0,
      message: '删除日程成功'
    });
  } catch (error) {
    console.error('删除日程失败', error);
    res.status(500).json({
      code: 500,
      message: '删除日程失败',
      error: error.message
    });
  }
});

module.exports = router;
