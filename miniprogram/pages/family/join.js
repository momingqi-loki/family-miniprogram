// pages/family/join.js - 加入或创建家庭
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    activeTab: 'create',
    familyName: '',
    description: '',
    inviteCode: ''
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  onFamilyNameInput: function(e) {
    this.setData({ familyName: e.detail.value })
  },

  onDescriptionInput: function(e) {
    this.setData({ description: e.detail.value })
  },

  onCodeInput: function(e) {
    this.setData({ inviteCode: e.detail.value.toUpperCase() })
  },

  // 创建家庭
  onCreateFamily: function() {
    if (!this.data.familyName) {
      wx.showToast({ title: '请输入家庭名称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '创建中...' })

    request({
      url: '/family',
      method: 'POST',
      data: {
        name: this.data.familyName,
        description: this.data.description
      }
    }).then(res => {
      wx.hideLoading()
      this.handleFamilySuccess(res.data)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '创建失败', icon: 'none' })
      console.error('创建家庭失败', err)
    })
  },

  // 加入家庭
  onJoinFamily: function() {
    if (!this.data.inviteCode || this.data.inviteCode.length < 6) {
      wx.showToast({ title: '请输入正确的邀请码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '加入中...' })

    request({
      url: '/family/join',
      method: 'POST',
      data: {
        inviteCode: this.data.inviteCode
      }
    }).then(res => {
      wx.hideLoading()
      this.handleFamilySuccess(res.data)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '邀请码无效', icon: 'none' })
      console.error('加入家庭失败', err)
    })
  },

  // 扫码加入
  onScanQRCode: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        // 解析二维码内容，提取邀请码
        const code = res.result
        this.setData({ inviteCode: code })
        this.onJoinFamily()
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' })
      }
    })
  },

  // 处理加入/创建成功
  handleFamilySuccess: function(data) {
    // 保存家庭信息
    app.globalData.familyInfo = data.family
    wx.setStorageSync('familyInfo', data.family)

    wx.showToast({
      title: '成功！',
      icon: 'success'
    })

    // 跳转到首页
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }
})
