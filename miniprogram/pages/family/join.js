// pages/family/join.js - 加入或创建家庭（调试版）
const app = getApp()
const { request } = require('../../utils/request')

Page({
  data: {
    activeTab: 'create',
    familyName: '',
    description: '',
    inviteCode: ''
  },

  onLoad: function() {
    // 如果是调试模式，直接创建模拟家庭
    const isDebugMode = wx.getStorageSync('debugMode')
    if (isDebugMode) {
      this.debugCreateFamily()
    }
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

    // 调试模式：直接跳过API调用
    const isDebugMode = wx.getStorageSync('debugMode')
    if (isDebugMode) {
      this.debugCreateFamily()
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

  // 调试模式创建家庭
  debugCreateFamily: function() {
    wx.showLoading({ title: '创建中...' })

    const mockFamily = {
      _id: 'debug_family_' + Date.now(),
      name: this.data.familyName || '我的家庭',
      inviteCode: 'ABC123',
      description: this.data.description || ''
    }

    // 保存家庭信息
    app.globalData.familyInfo = mockFamily
    wx.setStorageSync('familyInfo', mockFamily)

    // 更新用户信息
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.familyId = mockFamily._id
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '创建成功！',
        icon: 'success'
      })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 500)
  },

  // 加入家庭
  onJoinFamily: function() {
    if (!this.data.inviteCode || this.data.inviteCode.length < 6) {
      wx.showToast({ title: '请输入正确的邀请码', icon: 'none' })
      return
    }

    // 调试模式：直接跳过
    const isDebugMode = wx.getStorageSync('debugMode')
    if (isDebugMode) {
      this.debugJoinFamily()
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

  // 调试模式加入家庭
  debugJoinFamily: function() {
    wx.showLoading({ title: '加入中...' })

    const mockFamily = {
      _id: 'debug_family_joined_' + Date.now(),
      name: '家庭 ' + this.data.inviteCode,
      inviteCode: this.data.inviteCode,
      description: ''
    }

    // 保存家庭信息
    app.globalData.familyInfo = mockFamily
    wx.setStorageSync('familyInfo', mockFamily)

    // 更新用户信息
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.familyId = mockFamily._id
    wx.setStorageSync('userInfo', userInfo)
    app.globalData.userInfo = userInfo

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '加入成功！',
        icon: 'success'
      })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }, 500)
  },

  // 扫码加入
  onScanQRCode: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
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
    app.globalData.familyInfo = data
    wx.setStorageSync('familyInfo', data)

    wx.showToast({
      title: '成功！',
      icon: 'success'
    })

    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }
})
