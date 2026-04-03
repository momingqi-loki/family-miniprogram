// utils/request.js - 网络请求工具

// 请求基础配置
const BASE_URL = 'http://localhost:3000/api'; // 开发环境

// 获取token
function getToken() {
  return wx.getStorageSync('token') || '';
}

// 设置token
function setToken(token) {
  wx.setStorageSync('token', token);
}

// 清除token
function clearToken() {
  wx.removeStorageSync('token');
}

// 请求拦截器
function request(options) {
  return new Promise((resolve, reject) => {
    // 显示loading
    if (options.showLoading !== false) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
    }

    // 构建请求头
    const header = {
      'content-type': 'application/json',
      ...options.header
    };

    // 添加认证token
    const token = getToken();
    if (token) {
      header['authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      success: (res) => {
        // 隐藏loading
        wx.hideLoading();

        // 处理响应
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data);
          } else {
            // 业务错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // token过期，跳转登录
          clearToken();
          wx.showToast({
            title: '登录已过期',
            icon: 'none'
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/index'
            });
          }, 1500);
          reject(res.data);
        } else {
          // HTTP错误
          wx.showToast({
            title: `请求失败：${res.statusCode}`,
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        // 隐藏loading
        wx.hideLoading();

        // 网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        reject(err);
      },
      complete: () => {
        // 请求完成
        if (options.complete) {
          options.complete();
        }
      }
    });
  });
}

// GET请求
function get(url, data = {}) {
  return request({
    url: url,
    method: 'GET',
    data: data
  });
}

// POST请求
function post(url, data = {}) {
  return request({
    url: url,
    method: 'POST',
    data: data
  });
}

// PUT请求
function put(url, data = {}) {
  return request({
    url: url,
    method: 'PUT',
    data: data
  });
}

// DELETE请求
function del(url, data = {}) {
  return request({
    url: url,
    method: 'DELETE',
    data: data
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del,
  getToken,
  setToken,
  clearToken
};
