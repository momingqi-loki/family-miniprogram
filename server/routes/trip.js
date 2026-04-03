const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const User = require('../models/user');

// 获取旅游列表
router.get('/', async (req, res) => {
  try {
    const familyId = req.user.familyId;

    const trips = await Trip.find({ familyId })
      .populate('participants', 'nickname')
      .populate('createdBy', 'nickname')
      .sort({ startDate: -1 });

    const tripsWithCounts = trips.map(trip => ({
      ...trip._doc,
      participantCount: trip.participants.length,
      statusText: {
        planning: '规划中',
        confirmed: '已确定',
        completed: '已完成'
      }[trip.status]
    }));

    res.json({
      code: 0,
      message: 'success',
      data: tripsWithCounts
    });
  } catch (error) {
    console.error('获取旅游列表失败', error);
    res.status(500).json({
      code: 500,
      message: '获取旅游列表失败',
      error: error.message
    });
  }
});

// 获取旅游详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id)
      .populate('participants', 'nickname')
      .populate('createdBy', 'nickname');

    if (!trip) {
      return res.status(404).json({
        code: 404,
        message: '旅游不存在'
      });
    }

    // 检查权限
    if (trip.familyId.toString() !== req.user.familyId.toString()) {
      return res.status(403).json({
        code: 403,
        message: '无权限查看此旅游'
      });
    }

    res.json({
      code: 0,
      message: 'success',
      data: {
        ...trip._doc,
        participantCount: trip.participants.length
      }
    });
  } catch (error) {
    console.error('获取旅游详情失败', error);
    res.status(500).json({
      code: 500,
      message: '获取旅游详情失败',
      error: error.message
    });
  }
});

// 创建旅游
router.post('/', async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      participants,
      budget,
      remark
    } = req.body;

    const familyId = req.user.familyId;
    const createdBy = req.user._id;

    // 验证参数
    if (!destination || !startDate) {
      return res.json({
        code: 400,
        message: '目的地和开始日期不能为空'
      });
    }

    if (!participants || participants.length === 0) {
      return res.json({
        code: 400,
        message: '请选择参与人'
      });
    }

    const trip = new Trip({
      familyId,
      destination,
      startDate,
      endDate,
      participants,
      budget,
      remark,
      createdBy
    });

    await trip.save();

    res.json({
      code: 0,
      message: '创建旅游成功',
      data: trip
    });
  } catch (error) {
    console.error('创建旅游失败', error);
    res.status(500).json({
      code: 500,
      message: '创建旅游失败',
      error: error.message
    });
  }
});

// 更新旅游
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      destination,
      startDate,
      endDate,
      participants,
      budget,
      remark,
      status
    } = req.body;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        code: 404,
        message: '旅游不存在'
      });
    }

    // 检查权限
    if (trip.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限修改此旅游'
      });
    }

    // 更新旅游
    Object.assign(trip, {
      destination: destination || trip.destination,
      startDate: startDate || trip.startDate,
      endDate: endDate || trip.endDate,
      participants: participants || trip.participants,
      budget: budget !== undefined ? budget : trip.budget,
      remark: remark !== undefined ? remark : trip.remark,
      status: status || trip.status
    });

    await trip.save();

    res.json({
      code: 0,
      message: '更新旅游成功',
      data: trip
    });
  } catch (error) {
    console.error('更新旅游失败', error);
    res.status(500).json({
      code: 500,
      message: '更新旅游失败',
      error: error.message
    });
  }
});

// 删除旅游
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        code: 404,
        message: '旅游不存在'
      });
    }

    // 检查权限
    if (trip.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        message: '无权限删除此旅游'
      });
    }

    await Trip.findByIdAndDelete(id);

    res.json({
      code: 0,
      message: '删除旅游成功'
    });
  } catch (error) {
    console.error('删除旅游失败', error);
    res.status(500).json({
      code: 500,
      message: '删除旅游失败',
      error: error.message
    });
  }
});

module.exports = router;
