var brandService = require('../../apis/brand/brandService')
var mobileService = require('../../apis/mobile/mobileService')
var msgDlg = require('../../utils/msgDlg')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    scrollLeft: 0,
    houseInfo: [
      { num: 1, price: 500 },
      { num: 50, price: 300 }
    ],
    urlPrefix: app.globalData.baseUrl,
    detailInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      mobileService.detailOfGoods({
        data: { id: options.id },
        success: function (result) {
          if (result.data && (!result.data.msg || result.data.msg !== 'fail')) {
          } else msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false);
        },
        fail: (result) => {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false);
        },
        complete: (result) => {
          msgDlg.hideLoading();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  switchTab: function (e) {
    this.setData({ currentTab: e.detail.current });
    this.checkCor();
  },
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) return false;
    else this.setData({ currentTab: e.target.dataset.current });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) this.setData({ scrollLeft: 300 });
    else this.setData({ scrollLeft: 0 });
  },
})