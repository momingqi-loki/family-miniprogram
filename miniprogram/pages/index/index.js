// pages/index/index.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    userInfo: null,
    todayTasks: [],
    todayEvents: [],
    familyMembers: []
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.loadTodayData()
    this.loadFamilyMembers()
  },

  onShow: function () {
    this.loadTodayData()
  },

  // 加载今日数据
  loadTodayData: function () {
    const today = this.getTodayDate()

    // 加载今日任务
    request.get('/tasks/today', { date: today }).then(res => {
      this.setData({
        todayTasks: res.data || []
      })
    }).catch(err => {
      console.error('加载今日任务失败', err)
    })

    // 加载今日日程
    request.get('/events/today', { date: today }).then(res => {
      this.setData({
        todayEvents: res.data || []
      })
    }).catch(err => {
      console.error('加载今日日程失败', err)
    })
  },

  // 加载家庭成员
  loadFamilyMembers: function () {
    request.get('/family/members').then(res => {
      this.setData({
        familyMembers: res.data || []
      })
    }).catch(err => {
      console.error('加载家庭成员失败', err)
    })
  },

  // 获取今天日期
  getTodayDate: function () {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 点击任务
  onTaskClick: function (e) {
    const taskId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/task/detail?id=${taskId}`
    })
  },

  // 点击日程
  onEventClick: function (e) {
    const eventId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/schedule/detail?id=${eventId}`
    })
  }
})
