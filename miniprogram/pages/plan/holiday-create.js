// pages/plan/holiday-create.js - 创建/编辑节日
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    holidayId: null,
    holiday: {
      name: '',
      date: '',
      type: 'birthday',
      isLunar: false,
      description: ''
    },
    types: [
      { value: 'birthday', name: '生日', icon: '🎂' },
      { value: 'anniversary', name: '纪念日', icon: '💕' },
      { value: 'reunion', name: '聚餐', icon: '🍽️' },
      { value: 'festival', name: '节日', icon: '🏮' },
      { value: 'vacation', name: '假期', icon: '✈️' },
      { value: 'other', name: '其他', icon: '📌' }
    ]
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({ holidayId: options.id })
      wx.setNavigationBarTitle({ title: '编辑节日' })
      this.loadHoliday(options.id)
    } else {
      // 设置默认日期为今天
      const today = new Date().toISOString().split('T')[0]
      this.setData({
        'holiday.date': today
      })
    }
  },

  loadHoliday: function(id) {
    request({
      url: `/holidays/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({ holiday: res.data })
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onNameInput: function(e) {
    this.setData({ 'holiday.name': e.detail.value })
  },

  onDateChange: function(e) {
    this.setData({ 'holiday.date': e.detail.value })
  },

  onTypeSelect: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ 'holiday.type': type })
  },

  onCalendarChange: function(e) {
    const isLunar = e.currentTarget.dataset.lunar === 'true'
    this.setData({ 'holiday.isLunar': isLunar })
  },

  onDescriptionInput: function(e) {
    this.setData({ 'holiday.description': e.detail.value })
  },

  submit: function() {
    const holiday = this.data.holiday
    
    if (!holiday.name || !holiday.date) {
      wx.showToast({ title: '请填写名称和日期', icon: 'none' })
      return
    }

    const method = this.data.holidayId ? 'PUT' : 'POST'
    const url = this.data.holidayId ? `/holidays/${this.data.holidayId}` : '/holidays'

    request({
      url: url,
      method: method,
      data: holiday
    }).then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  }
})
