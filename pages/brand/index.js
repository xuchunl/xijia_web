var brandService = require('../../apis/brand/brandService')
var mobileService = require('../../apis/mobile/mobileService.js')
var msgDlg = require('../../utils/msgDlg')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    userInfo: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo});
    if (options.brandId) {
      brandService.brandGoodList({
        data: { mallBean: { brandId: options.brandId} },
        success: (res) => {
          console.log('res.data', res);
          if (res.data && !res.data.message && res.data.msg != 'fail') {
            this.setData({
              productList: res.data || []
            })
          } else {
            msgDlg.showModal('错误提示', res.data.message || res.data.state || '查询出错！', false)
          }
        },
        fail: (res) => {
          msgDlg.showModal('错误提示', res.state || '查询出错！', false)
        },
        complete: (res) => {
          msgDlg.hideLoading();
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toDetail: function(e) {
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.product.id,
    })
  },
  toBuyUser: (e) => {
    console.log(e);
    wx.navigateTo({
      url: 'buy-detail?brandId=',
    })
  }
})