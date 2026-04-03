// miniprogram/app.js - 小程序入口
App({
  globalData: {
    userInfo: null,
    familyInfo: null,
    token: null,
    isLogin: false
  },

  onLaunch: function() {
    // 检查登录状态
    this.checkLoginStatus()
  },

  onShow: function() {
    // 每次进入应用检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    const familyInfo = wx.getStorageSync('familyInfo')

    this.globalData.token = token
    this.globalData.userInfo = userInfo
    this.globalData.familyInfo = familyInfo
    this.globalData.isLogin = !!(token && userInfo)
  },

  // 检查是否需要跳转登录页
  checkAuth: function(callback) {
    if (this.globalData.isLogin) {
      callback && callback()
    } else {
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  },

  // 检查是否已加入家庭
  checkFamily: function(callback) {
    if (this.globalData.familyInfo && this.globalData.familyInfo._id) {
      callback && callback()
    } else {
      wx.redirectTo({
        url: '/pages/family/join'
      })
    }
  },

  // 退出登录
  logout: function() {
    wx.clearStorageSync()
    this.globalData = {
      userInfo: null,
      familyInfo: null,
      token: null,
      isLogin: false
    }
    wx.redirectTo({
      url: '/pages/login/index'
    })
  }
})
