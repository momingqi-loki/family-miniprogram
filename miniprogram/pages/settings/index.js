// pages/settings/index.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    userInfo: null,
    familyInfo: null,
    familyMembers: []
  },

  onLoad: function () {
    this.loadUserInfo()
    this.loadFamilyInfo()
    this.loadFamilyMembers()
  },

  onShow: function () {
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo: function () {
    request.get('/user/profile').then(res => {
      this.setData({
        userInfo: res.data
      })
    }).catch(err => {
      console.error('加载用户信息失败', err)
    })
  },

  // 加载家庭信息
  loadFamilyInfo: function () {
    if (!app.globalData.familyId) {
      return
    }

    request.get('/family/info').then(res => {
      this.setData({
        familyInfo: res.data
      })
    }).catch(err => {
      console.error('加载家庭信息失败', err)
    })
  },

  // 加载家庭成员
  loadFamilyMembers: function () {
    if (!app.globalData.familyId) {
      return
    }

    request.get('/family/members').then(res => {
      this.setData({
        familyMembers: res.data || []
      })
    }).catch(err => {
      console.error('加载家庭成员失败', err)
    })
  },

  // 编辑个人信息
  editProfile: function () {
    wx.navigateTo({
      url: '/pages/settings/profile'
    })
  },

  // 创建家庭
  createFamily: function () {
    wx.navigateTo({
      url: '/pages/settings/family-create'
    })
  },

  // 邀请成员
  inviteMember: function () {
    wx.showModal({
      title: '邀请成员',
      content: '邀请功能待实现',
      showCancel: false
    })
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync('token')
          wx.clearStorageSync('userInfo')
          app.globalData.token = null
          app.globalData.userInfo = null
          app.globalData.familyId = null

          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })

          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      }
    })
  }
})
