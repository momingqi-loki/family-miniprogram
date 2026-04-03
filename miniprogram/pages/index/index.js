// pages/index/index.js - 首页逻辑
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    userInfo: null,
    greeting: '你好',
    todayDate: '',
    taskCount: 0,
    eventCount: 0,
    memberCount: 0,
    todayTasks: [],
    todayEvents: [],
    familyMembers: []
  },

  onLoad: function() {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({ url: '/pages/login/index' })
      return
    }
    
    this.setData({
      userInfo: app.globalData.userInfo
    })
    
    // 设置问候语
    this.setGreeting()
    this.setData({
      todayDate: this.formatDate(new Date())
    })
  },

  onShow: function() {
    if (!app.globalData.isLogin) return
    
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.loadData()
  },

  // 设置问候语
  setGreeting: function() {
    const hour = new Date().getHours()
    let greeting = '你好'
    
    if (hour >= 5 && hour < 12) {
      greeting = '早上好'
    } else if (hour >= 12 && hour < 14) {
      greeting = '中午好'
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好'
    } else {
      greeting = '晚上好'
    }
    
    this.setData({ greeting })
  },

  // 格式化日期
  formatDate: function(date) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = weekDays[date.getDay()]
    return `${year}年${month}月${day}日 ${weekDay}`
  },

  // 加载数据
  loadData: function() {
    this.loadTodayTasks()
    this.loadTodayEvents()
    this.loadFamilyMembers()
  },

  // 加载今日任务
  loadTodayTasks: function() {
    const today = new Date().toISOString().split('T')[0]
    request({
      url: '/tasks/today',
      method: 'GET',
      data: { date: today }
    }).then(res => {
      this.setData({
        todayTasks: res.data || [],
        taskCount: res.data?.length || 0
      })
    }).catch(err => {
      console.error('加载任务失败', err)
    })
  },

  // 加载今日日程
  loadTodayEvents: function() {
    request({
      url: '/events/today',
      method: 'GET'
    }).then(res => {
      this.setData({
        todayEvents: res.data || [],
        eventCount: res.data?.length || 0
      })
    }).catch(err => {
      console.error('加载日程失败', err)
    })
  },

  // 加载家庭成员
  loadFamilyMembers: function() {
    request({
      url: '/family/members',
      method: 'GET'
    }).then(res => {
      this.setData({
        familyMembers: res.data || [],
        memberCount: res.data?.length || 0
      })
    }).catch(err => {
      console.error('加载成员失败', err)
    })
  },

  // 点击任务
  onTaskClick: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/task/detail?id=${id}`
    })
  },

  // 切换任务状态
  onToggleTask: function(e) {
    const id = e.currentTarget.dataset.id
    const tasks = this.data.todayTasks
    const task = tasks.find(t => t._id === id)
    if (!task) return

    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    
    request({
      url: `/tasks/${id}`,
      method: 'PUT',
      data: { ...task, status: newStatus }
    }).then(() => {
      this.loadTodayTasks()
    })
  },

  // 点击日程
  onEventClick: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/schedule/detail?id=${id}`
    })
  },

  // 查看全部任务
  onViewAllTasks: function() {
    wx.switchTab({ url: '/pages/task/index' })
  },

  // 查看全部日程
  onViewAllEvents: function() {
    wx.switchTab({ url: '/pages/schedule/index' })
  },

  // 快捷添加任务
  onQuickAddTask: function() {
    wx.navigateTo({ url: '/pages/task/create' })
  },

  // 快捷添加日程
  onQuickAddEvent: function() {
    wx.navigateTo({ url: '/pages/schedule/create' })
  },

  // 旅行规划
  onPlanTrip: function() {
    wx.navigateTo({ url: '/pages/plan/trip-create' })
  },

  // 节日计划
  onPlanHoliday: function() {
    wx.navigateTo({ url: '/pages/plan/holiday-create' })
  },

  // 管理家庭
  onManageFamily: function() {
    wx.navigateTo({ url: '/pages/settings/index' })
  },

  // 天气提示（预留）
  onWeatherHint: function() {
    wx.showToast({
      title: '天气功能开发中',
      icon: 'none'
    })
  }
})
