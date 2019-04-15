//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  //事件处理函数
  requestdemo: function () {
    wx: wx.request({
      url: 'https://www.onezxkj.com/hyht/mini/login/login.action',
      data: {
        'code': 'qwe',
        'mem.sex': '123'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {},
      fail: function (res) {}

    })
  },

  onLoad: function () {
    this.requestdemo()
  }
})