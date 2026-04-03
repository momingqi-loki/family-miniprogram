// pages/plan/trip-create.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    form: {
      destination: '',
      startDate: '',
      endDate: '',
      participants: [],
      budget: '',
      remark: ''
    },
    familyMembers: []
  },

  onLoad: function () {
    this.loadFamilyMembers()
  },

  // 加载家庭成员
  loadFamilyMembers: function () {
    request.get('/family/members').then(res => {
      const members = res.data.map(member => ({
        ...member,
        selected: false
      }))
      this.setData({
        familyMembers: members
      })
    }).catch(err => {
      console.error('加载家庭成员失败', err)
    })
  },

  // 选择开始日期
  bindStartDateChange: function (e) {
    this.setData({
      'form.startDate': e.detail.value
    })
  },

  // 选择结束日期
  bindEndDateChange: function (e) {
    this.setData({
      'form.endDate': e.detail.value
    })
  },

  // 选择参与人
  selectParticipant: function (e) {
    const index = e.currentTarget.dataset.index
    const members = this.data.familyMembers
    members[index].selected = !members[index].selected

    const selectedIds = members.filter(m => m.selected).map(m => m._id)

    this.setData({
      familyMembers: members,
      'form.participants': selectedIds
    })
  },

  // 输入目的地
  bindDestinationInput: function (e) {
    this.setData({
      'form.destination': e.detail.value
    })
  },

  // 输入预算
  bindBudgetInput: function (e) {
    this.setData({
      'form.budget': e.detail.value
    })
  },

  // 输入备注
  bindRemarkInput: function (e) {
    this.setData({
      'form.remark': e.detail.value
    })
  },

  // 提交表单
  submitForm: function () {
    const form = this.data.form

    // 验证
    if (!form.destination) {
      wx.showToast({
        title: '请输入目的地',
        icon: 'none'
      })
      return
    }

    if (!form.startDate) {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'none'
      })
      return
    }

    if (form.participants.length === 0) {
      wx.showToast({
        title: '请选择参与人',
        icon: 'none'
      })
      return
    }

    // 创建旅游
    request.post('/trips', form).then(res => {
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }).catch(err => {
      console.error('创建旅游失败', err)
    })
  },

  // 取消
  cancel: function () {
    wx.navigateBack()
  }
})
