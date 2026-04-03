// pages/schedule/detail.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    event: null,
    loading: true
  },

  onLoad: function(options) {
    const id = options.id
    if (id) {
      this.loadEvent(id)
    }
  },

  loadEvent: function(id) {
    request({
      url: `/events/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({
        event: res.data,
        loading: false
      })
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    })
  },

  editEvent: function() {
    wx.navigateTo({
      url: `/pages/schedule/create?id=${this.data.event._id}`
    })
  },

  deleteEvent: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个日程吗？',
      success: res => {
        if (res.confirm) {
          request({
            url: `/events/${this.data.event._id}`,
            method: 'DELETE'
          }).then(() => {
            wx.showToast({ title: '删除成功' })
            setTimeout(() => wx.navigateBack(), 1500)
          })
        }
      }
    })
  }
})
