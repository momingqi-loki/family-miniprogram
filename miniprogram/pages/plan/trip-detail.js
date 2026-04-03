// pages/plan/trip-detail.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    tripId: '',
    trip: null,
    loading: true
  },

  onLoad: function (options) {
    const tripId = options.id
    this.setData({
      tripId
    })
    this.loadTripDetail()
  },

  // 加载旅游详情
  loadTripDetail: function () {
    request.get(`/trips/${this.data.tripId}`).then(res => {
      this.setData({
        trip: res.data,
        loading: false
      })
    }).catch(err => {
      console.error('加载旅游详情失败', err)
      this.setData({
        loading: false
      })
    })
  },

  // 编辑旅游
  editTrip: function () {
    wx.navigateTo({
      url: `/pages/plan/trip-create?id=${this.data.tripId}`
    })
  },

  // 删除旅游
  deleteTrip: function () {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个旅游计划吗？',
      success: (res) => {
        if (res.confirm) {
          request.delete(`/trips/${this.data.tripId}`).then(res => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          }).catch(err => {
            console.error('删除旅游失败', err)
          })
        }
      }
    })
  }
})
