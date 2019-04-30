var orderService = require('../../apis/order/orderService')
var msgDlg = require('../../utils/msgDlg')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft: 0,
    currentTab: 0,
    status: '',
    member: {},
    orderList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let status = options.status
    let member = wx.getStorageSync('member');
    this.setData({ status: status, member: member });
    this.loadData();
  },
  loadData: function() {
    msgDlg.showLoading('正在加载中');
    orderService.queryOrderList({
      data: { memId: this.data.member.id, status: this.data.status },
      success: (res) => {
        if (res.data && res.data.msg_type && res.data.msg_type == 'success') {
          if (res.data.msg && res.data.msg.orderList) {
            this.setData({ orderList: res.data.msg.orderList || [] });
          }
        }
      },
      fail: (err) => {
        msgDlg.showModal('错误提示', res.data.msg || '查询出错！', false)
       },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    });
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
    let status = this.data.status;
    debugger
    if (e.detail.current == 0) status = '';
    else if (e.detail.current == 1) status = 'wfk';
    else if (e.detail.current == 2) status = 'yfh';
    else if (e.detail.current == 3) status = 'ysh';
    this.setData({ currentTab: e.detail.current, status: status });
    this.loadData();
    this.checkCor();
  },
  swichNav: function (e) {
    let status = this.data.status;
    if (e.target.dataset.current == 0) status = '';
    else if (e.target.dataset.current == 1) status = 'wfk';
    else if (e.target.dataset.current == 2) status = 'yfh';
    else if (e.target.dataset.current == 3) status = 'ysh';
    if (this.data.currentTab === e.target.dataset.current) return false;
    else this.setData({ currentTab: e.target.dataset.current, status: status })
    this.loadData();
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) this.setData({ scrollLeft: 300 });
    else this.setData({ scrollLeft: 0 });
  },
})