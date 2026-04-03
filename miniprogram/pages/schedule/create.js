// pages/schedule/create.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    event: {
      title: '',
      date: '',
      time: '',
      description: '',
      type: 'meeting'
    },
    types: ['meeting', 'reminder', 'activity', 'other'],
    familyMembers: []
  },

  onLoad: function(options) {
    if (options.id) {
      wx.setNavigationBarTitle({ title: '编辑日程' })
      this.loadEvent(options.id)
    }
    this.loadFamilyMembers()
    
    // 默认日期为今天
    const today = new Date().toISOString().split('T')[0]
    this.setData({
      'event.date': options.date || today
    })
  },

  loadEvent: function(id) {
    request({
      url: `/events/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({ event: res.data })
    })
  },

  loadFamilyMembers: function() {
    request({
      url: '/family/members'
    }).then(res => {
      this.setData({ familyMembers: res.data || [] })
    })
  },

  onTitleInput: function(e) {
    this.setData({ 'event.title': e.detail.value })
  },

  onDateChange: function(e) {
    this.setData({ 'event.date': e.detail.value })
  },

  onTimeChange: function(e) {
    this.setData({ 'event.time': e.detail.value })
  },

  onTypeChange: function(e) {
    const type = this.data.types[e.detail.value]
    this.setData({ 'event.type': type })
  },

  onDescriptionInput: function(e) {
    this.setData({ 'event.description': e.detail.value })
  },

  submit: function() {
    const event = this.data.event
    
    if (!event.title || !event.date) {
      wx.showToast({ title: '请填写标题和日期', icon: 'none' })
      return
    }

    const method = event._id ? 'PUT' : 'POST'
    const url = event._id ? `/events/${event._id}` : '/events'

    request({
      url: url,
      method: method,
      data: event
    }).then(() => {
      wx.showToast({ title: '保存成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  }
})
