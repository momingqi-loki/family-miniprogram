// pages/task/create.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    task: {
      title: '',
      description: '',
      priority: 'medium',
      deadline: '',
      assignee: ''
    },
    priorities: ['low', 'medium', 'high'],
    familyMembers: []
  },

  onLoad: function(options) {
    if (options.id) {
      wx.setNavigationBarTitle({ title: '编辑任务' })
      this.loadTask(options.id)
    }
    this.loadFamilyMembers()
  },

  loadTask: function(id) {
    request({
      url: `/tasks/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({ task: res.data })
    })
  },

  loadFamilyMembers: function() {
    request({
      url: '/family/members'
    }).then(res => {
      this.setData({ familyMembers: res.data || [] })
    })
  },

  onTitleInput: function(e) {
    this.setData({
      'task.title': e.detail.value
    })
  },

  onDescriptionInput: function(e) {
    this.setData({
      'task.description': e.detail.value
    })
  },

  onPriorityChange: function(e) {
    const priority = this.data.priorities[e.detail.value]
    this.setData({
      'task.priority': priority
    })
  },

  onDeadlineChange: function(e) {
    this.setData({
      'task.deadline': e.detail.value
    })
  },

  onAssigneeChange: function(e) {
    const index = e.detail.value
    const member = this.data.familyMembers[index]
    this.setData({
      'task.assignee': member._id
    })
  },

  submit: function() {
    const task = this.data.task
    
    if (!task.title) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const method = task._id ? 'PUT' : 'POST'
    const url = task._id ? `/tasks/${task._id}` : '/tasks'

    request({
      url: url,
      method: method,
      data: task
    }).then(() => {
      wx.showToast({ title: '保存成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    }).catch(() => {
      wx.showToast({ title: '保存失败', icon: 'none' })
    })
  }
})
