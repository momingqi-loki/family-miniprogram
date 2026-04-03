// pages/settings/profile.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    userInfo: null,
    formData: {
      name: '',
      phone: '',
      avatar: ''
    }
  },

  onLoad: function() {
    this.loadUserInfo()
  },

  onShow: function() {
    this.loadUserInfo()
  },

  loadUserInfo: function() {
    request({
      url: '/user/profile'
    }).then(res => {
      this.setData({
        userInfo: res.data,
        formData: {
          name: res.data.name || '',
          phone: res.data.phone || '',
          avatar: res.data.avatar || ''
        }
      })
    })
  },

  onNameInput: function(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onPhoneInput: function(e) {
    this.setData({ 'formData.phone': e.detail.value })
  },

  chooseAvatar: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 上传头像（实际项目中需要上传到服务器）
        this.setData({
          'formData.avatar': tempFilePath
        })
      }
    })
  },

  save: function() {
    const formData = this.data.formData
    
    if (!formData.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }

    request({
      url: '/user/profile',
      method: 'PUT',
      data: formData
    }).then(() => {
      wx.showToast({ title: '保存成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  }
})
