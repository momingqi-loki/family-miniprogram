// pages/login/index.js - 登录逻辑
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    loading: false
  },

  onLoad: function() {
    // 检查是否已登录
    const token = wx.getStorageSync('token')
    if (token) {
      this.checkToken(token)
    }
  },

  // 微信授权登录
  onWechatLogin: function() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    wx.showLoading({ title: '正在登录...' })

    // 调用微信登录
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送 code 到后端
          this.loginWithCode(res.code, 'wechat')
        } else {
          this.loginFail('微信登录失败')
        }
      },
      fail: () => {
        this.loginFail('微信登录失败')
      }
    })
  },

  // 手机号登录
  onPhoneLogin: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 使用 code 登录
  loginWithCode: function(code, loginType) {
    request({
      url: '/user/login',
      method: 'POST',
      data: { code, loginType }
    }).then(res => {
      const { token, user } = res.data
      
      // 保存登录信息
      wx.setStorageSync('token', token)
      wx.setStorageSync('userInfo', user)
      
      // 更新全局数据
      app.globalData.userInfo = user
      app.globalData.token = token

      wx.hideLoading()
      this.loginSuccess()
    }).catch(err => {
      console.error('登录失败', err)
      this.loginFail('登录失败，请重试')
    })
  },

  // 验证 token
  checkToken: function(token) {
    request({
      url: '/user/profile',
      method: 'GET'
    }).then(res => {
      app.globalData.userInfo = res.data
      // Token 有效，跳转到首页
      this.loginSuccess()
    }).catch(() => {
      // Token 失效，清除并留在登录页
      wx.removeStorageSync('token')
      wx.removeStorageSync('userInfo')
    })
  },

  // 登录成功
  loginSuccess: function() {
    this.setData({ loading: false })
    
    // 检查是否有家庭
    const userInfo = app.globalData.userInfo
    if (userInfo && userInfo.familyId) {
      // 已加入家庭，跳转到首页
      wx.switchTab({ url: '/pages/index/index' })
    } else {
      // 未加入家庭，跳转到家庭页
      wx.navigateTo({ url: '/pages/family/join' })
    }
  },

  // 登录失败
  loginFail: function(message) {
    this.setData({ loading: false })
    wx.hideLoading()
    wx.showToast({
      title: message,
      icon: 'none'
    })
  },

  // 显示用户协议
  onShowAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    })
  },

  // 显示隐私政策
  onShowPrivacy: function() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      showCancel: false
    })
  }
})
