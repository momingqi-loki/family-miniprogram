const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

// 获取今日任务
router.get('/today', async (req, res) => {
  try {
    const { date } = req.query;
    const familyId = req.user.familyId;

    // 获取截止日期为今天的任务
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      familyId,
      deadline: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('assignee', 'nickname')
      .populate('createdBy', 'nickname')
      .sort({ deadline: 1 });

    res.json({
      code: 0,
      message: 'success',
      data: tasks
    });
  } catch (error) {
    console.error('获取今日任务失败', error);
    res.status(500).json({
      code: 500,
      message: '获取今日任务失败',
      error: error.message
    });
  }
});

// 创建任务
router.post('/', async (req, res) => {
  try {
    const { title, type, assignee, deadline, remindTime, remark } = req.body;
    const familyId = req.user.familyId;
    const createdBy = req.user._id;

    const task = new Task({
      familyId,
      title,
      type,
      assignee,
      deadline,
      remindTime,
      remark,
      createdBy
    });

    await task.save();

    res.json({
      code: 0,
      message: '创建任务成功',
      data: task
    });
  } catch (error) {
    console.error('创建任务失败', error);
    res.status(500).json({
      code: 500,
      message: '创建任务失败',
      error: error.message
    });
  }
});

// 更新任务状态
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    task.status = status;

    if (status === 'completed') {
      task.completedAt = new Date();
    }

    await task.save();

    res.json({
      code: 0,
      message: '更新任务状态成功',
      data: task
    });
  } catch (error) {
    console.error('更新任务状态失败', error);
    res.status(500).json({
      code: 500,
      message: '更新任务状态失败',
      error: error.message
    });
  }
});

// 删除任务
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        code: 404,
        message: '任务不存在'
      });
    }

    // 检查权限
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此任务'
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({
      code: 0,
      message: '删除任务成功'
    });
  } catch (error) {
    console.error('删除任务失败', error);
    res.status(500).json({
      code: 500,
      message: '删除任务失败',
      error: error.message
    });
  }
});

module.exports = router;
