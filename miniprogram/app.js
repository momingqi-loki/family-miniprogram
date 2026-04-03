// 小程序入口文件
App({
  onLaunch: function () {
    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      familyId: null,
      token: null
    }

    // 检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    const familyId = wx.getStorageSync('familyId')

    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
      this.globalData.familyId = familyId
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    familyId: null,
    token: null
  }
})
