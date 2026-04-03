// pages/plan/holiday-create.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    form: {
      name: '',
      date: '',
      type: 'birthday',
      remindDays: 7,
      suggestions: ''
    },
    typeOptions: [
      { value: 'birthday', label: '生日', emoji: '🎂' },
      { value: 'anniversary', label: '纪念日', emoji: '💕' },
      { value: 'reunion', label: '家庭聚餐', emoji: '🍽️' },
      { value: 'festival', label: '传统节日', emoji: '🏮' }
    ]
  },

  // 输入节日名称
  bindNameInput: function (e) {
    this.setData({
      'form.name': e.detail.value
    })
  },

  // 选择日期
  bindDateChange: function (e) {
    this.setData({
      'form.date': e.detail.value
    })
  },

  // 选择类型
  bindTypeChange: function (e) {
    const type = this.data.typeOptions[e.detail.value].value
    this.setData({
      'form.type': type
    })
  },

  // 选择提醒天数
  bindRemindDaysChange: function (e) {
    this.setData({
      'form.remindDays': e.detail.value
    })
  },

  // 输入庆祝建议
  bindSuggestionsInput: function (e) {
    this.setData({
      'form.suggestions': e.detail.value
    })
  },

  // 提交表单
  submitForm: function () {
    const form = this.data.form

    // 验证
    if (!form.name) {
      wx.showToast({
        title: '请输入节日名称',
        icon: 'none'
      })
      return
    }

    if (!form.date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }

    // 创建节日
    request.post('/holidays', form).then(res => {
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }).catch(err => {
      console.error('创建节日失败', err)
    })
  },

  // 取消
  cancel: function () {
    wx.navigateBack()
  }
})
