var msgDlg = require('../../utils/msgDlg')
Page({
  data: {
    userInfo: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member = wx.getStorageSync('member') || {}
    this.setData({ userInfo: member});
  },
  toOrder: function (e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({ url: '../order/index?type=' + type})
  },
  onShopping: function (){
    wx.switchTab({
      url: '../index/index',
    })
  },
  onOut: function () {
    msgDlg.showModal('系统提示', '确定退出登录？', false, (res) => {
      if (res.confirm) {
        wx.setStorageSync('member', {});
        wx.setStorageSync('loginInfo', {});
        wx.switchTab({ url: '../index/index' });
      }
    });
  }
})