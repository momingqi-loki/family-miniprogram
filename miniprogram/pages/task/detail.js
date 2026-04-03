// pages/task/detail.js
const app = getApp()
const { request } = require('../utils/request')

Page({
  data: {
    task: null,
    loading: true
  },

  onLoad: function(options) {
    const id = options.id
    if (id) {
      this.loadTask(id)
    }
  },

  loadTask: function(id) {
    request({
      url: `/tasks/${id}`,
      method: 'GET'
    }).then(res => {
      this.setData({
        task: res.data,
        loading: false
      })
    }).catch(err => {
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    })
  },

  editTask: function() {
    wx.navigateTo({
      url: `/pages/task/create?id=${this.data.task._id}`
    })
  },

  deleteTask: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: res => {
        if (res.confirm) {
          request({
            url: `/tasks/${this.data.task._id}`,
            method: 'DELETE'
          }).then(() => {
            wx.showToast({ title: '删除成功' })
            setTimeout(() => wx.navigateBack(), 1500)
          })
        }
      }
    })
  },

  toggleStatus: function() {
    const task = this.data.task
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    
    request({
      url: `/tasks/${task._id}`,
      method: 'PUT',
      data: { ...task, status: newStatus }
    }).then(() => {
      this.loadTask(task._id)
    })
  }
})
