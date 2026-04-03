// pages/plan/index.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    activeTab: 'trip', // trip | holiday
    trips: [],
    holidays: []
  },

  onLoad: function () {
    this.loadTrips()
    this.loadHolidays()
  },

  onShow: function () {
    this.loadTrips()
    this.loadHolidays()
  },

  // 切换标签
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab
    })
  },

  // 加载旅游列表
  loadTrips: function () {
    request.get('/trips').then(res => {
      this.setData({
        trips: res.data || []
      })
    }).catch(err => {
      console.error('加载旅游列表失败', err)
    })
  },

  // 加载节日列表
  loadHolidays: function () {
    request.get('/holidays').then(res => {
      this.setData({
        holidays: res.data || []
      })
    }).catch(err => {
      console.error('加载节日列表失败', err)
    })
  },

  // 新建旅游
  createTrip: function () {
    wx.navigateTo({
      url: '/pages/plan/trip-create'
    })
  },

  // 查看旅游详情
  viewTrip: function (e) {
    const tripId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/plan/trip-detail?id=${tripId}`
    })
  },

  // 新建节日
  createHoliday: function () {
    wx.navigateTo({
      url: '/pages/plan/holiday-create'
    })
  },

  // 查看节日详情
  viewHoliday: function (e) {
    const holidayId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/plan/holiday-detail?id=${holidayId}`
    })
  }
})
