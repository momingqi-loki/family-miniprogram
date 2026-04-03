// pages/task/index.js
const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    activeTab: 'todo', // todo | inprogress | completed
    tasks: []
  },

  onLoad: function () {
    this.loadTasks('todo')
  },

  onShow: function () {
    this.loadTasks(this.data.activeTab)
  },

  // 切换标签
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab
    })
    this.loadTasks(tab)
  },

  // 加载任务列表
  loadTasks: function (status) {
    request.get('/tasks', { status }).then(res => {
      this.setData({
        tasks: res.data || []
      })
    }).catch(err => {
      console.error('加载任务列表失败', err)
    })
  },

  // 新建任务
  createTask: function () {
    wx.navigateTo({
      url: '/pages/task/create'
    })
  },

  // 查看任务详情
  viewTask: function (e) {
    const taskId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/task/detail?id=${taskId}`
    })
  },

  // 完成任务
  completeTask: function (e) {
    const taskId = e.currentTarget.dataset.id

    request.put(`/tasks/${taskId}/status`, { status: 'completed' }).then(res => {
      wx.showToast({
        title: '已完成',
        icon: 'success'
      })
      this.loadTasks(this.data.activeTab)
    }).catch(err => {
      console.error('完成任务失败', err)
    })
  }
})
