// pages/plan/holiday-detail.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    holiday: null,
    loading: true
  },

  onLoad: function(options) {
    const id = options.id
    if (id) {
      this.loadHoliday(id)
    }
  },

  loadHoliday: function(id) {
    request({
      url: `/holidays/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({
        holiday: res.data,
        loading: false
      })
    }).catch(err => {
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    })
  },

  editHoliday: function() {
    const holiday = this.data.holiday
    wx.navigateTo({
      url: `/pages/plan/holiday-create?id=${holiday._id}`
    })
  },

  deleteHoliday: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个节日计划吗？',
      success: res => {
        if (res.confirm) {
          request({
            url: `/holidays/${this.data.holiday._id}`,
            method: 'DELETE'
          }).then(() => {
            wx.showToast({ title: '删除成功' })
            setTimeout(() => wx.navigateBack(), 1500)
          }).catch(() => {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  }
})
