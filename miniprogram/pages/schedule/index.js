// pages/schedule/index.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    currentDate: '',
    currentYear: '',
    currentMonth: '',
    selectedDate: '',
    events: [],
    todayEvents: []
  },

  onLoad: function () {
    const now = new Date()
    this.setData({
      currentDate: this.formatDate(now),
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      selectedDate: this.formatDate(now)
    })
    this.loadTodayEvents()
    this.loadCalendarEvents()
  },

  onShow: function () {
    this.loadTodayEvents()
  },

  // 格式化日期
  formatDate: function (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 加载今日日程
  loadTodayEvents: function () {
    request.get('/events/today', { date: this.data.currentDate }).then(res => {
      this.setData({
        todayEvents: res.data || []
      })
    }).catch(err => {
      console.error('加载今日日程失败', err)
    })
  },

  // 加载日历视图
  loadCalendarEvents: function () {
    request.get('/events/calendar', {
      year: this.data.currentYear,
      month: this.data.currentMonth
    }).then(res => {
      this.setData({
        events: res.data || []
      })
    }).catch(err => {
      console.error('加载日历视图失败', err)
    })
  },

  // 上一月
  prevMonth: function () {
    let month = this.data.currentMonth - 1
    let year = this.data.currentYear

    if (month < 1) {
      month = 12
      year -= 1
    }

    this.setData({
      currentYear: year,
      currentMonth: month
    })
    this.loadCalendarEvents()
  },

  // 下一月
  nextMonth: function () {
    let month = this.data.currentMonth + 1
    let year = this.data.currentYear

    if (month > 12) {
      month = 1
      year += 1
    }

    this.setData({
      currentYear: year,
      currentMonth: month
    })
    this.loadCalendarEvents()
  },

  // 新建日程
  createEvent: function () {
    wx.navigateTo({
      url: '/pages/schedule/create'
    })
  },

  // 查看日程详情
  viewEvent: function (e) {
    const eventId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/schedule/detail?id=${eventId}`
    })
  }
})
