// pages/settings/index.js - 设置页面逻辑
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    userInfo: null,
    familyInfo: null,
    inviteCode: '',
    notificationsEnabled: true
  },

  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      familyInfo: app.globalData.familyInfo,
      notificationsEnabled: wx.getStorageSync('notificationsEnabled') !== false
    })
    
    if (app.globalData.isLogin) {
      this.loadData()
    }
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      familyInfo: app.globalData.familyInfo
    })
  },

  loadData: function() {
    // 加载家庭邀请码
    request({
      url: '/family/invite-code',
      method: 'GET'
    }).then(res => {
      this.setData({ inviteCode: res.data.inviteCode })
    }).catch(err => {
      console.error('获取邀请码失败', err)
    })
  },

  // 编辑个人资料
  onEditProfile: function() {
    wx.navigateTo({ url: '/pages/settings/profile' })
  },

  // 家庭信息
  onFamilyInfo: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 邀请成员
  onInviteCode: function() {
    if (!this.data.inviteCode) {
      wx.showToast({ title: '请先创建或加入家庭', icon: 'none' })
      return
    }

    wx.showModal({
      title: '邀请码',
      content: `您的家庭邀请码是：${this.data.inviteCode}\n\n分享给家人，让他们加入您的家庭`,
      confirmText: '复制',
      success: res => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.inviteCode,
            success: () => {
              wx.showToast({ title: '已复制', icon: 'success' })
            }
          })
        }
      }
    })
  },

  // 成员列表
  onFamilyMembers: function() {
    wx.navigateTo({ url: '/pages/family/join' })
  },

  // 通知设置
  onToggleNotification: function() {
    const enabled = !this.data.notificationsEnabled
    this.setData({ notificationsEnabled: enabled })
    wx.setStorageSync('notificationsEnabled', enabled)
    
    if (enabled) {
      wx.showToast({ title: '已开启通知', icon: 'success' })
    } else {
      wx.showToast({ title: '已关闭通知', icon: 'none' })
    }
  },

  onNotifications: function() {
    this.onToggleNotification()
  },

  // 隐私设置
  onPrivacy: function() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 关于我们
  onAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: '家庭管理小程序 v1.0.0\n\n帮助家庭成员更好地管理日常事务、旅行规划和节日庆祝。\n\n© 2024 Family Management',
      showCancel: false
    })
  },

  // 退出登录
  onLogout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          request({
            url: '/user/logout',
            method: 'POST'
          }).catch(() => {})
          
          app.logout()
        }
      }
    })
  }
})
