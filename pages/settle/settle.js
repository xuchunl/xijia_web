// pages/settle/settle.js
var cartService = require('../../apis/cart/cartService')
var orderService = require('../../apis/order/orderService')
var msgDlg = require('../../utils/msgDlg')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adressList: [],
    addressInfo: {},
    goodsList: [],
    urlPrefix: app.globalData.baseUrl,
    sumPrice: 0,
    member: {},
    receiver: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member = wx.getStorageSync('member') 
    let $this = this
    let goodsList = [];
    let sumPrice = 0
    goodsList = wx.getStorageSync("goodsList");
    if (options.pageType) {
      if (options.pageType == "mobile") {
      } else if (options.pageType == "goodsList") {
      }
      goodsList.filter(item => {
        sumPrice = Number(item.price) * Number(item.num) + sumPrice;
        item.totalMny = Number(item.price) * Number(item.num);
      })
    }
    this.setData({
      goodsList: goodsList,
      sumPrice: sumPrice,
      member: member
    })
  },
  checkAddress: function(){
    wx.navigateTo({
      url: '../receiver/index?id=' + this.data.addressInfo.id,
    })
  },
  onSubmit: function () {
    let member = this.data.member;
    if (!member.nickname) {
      wx.showToast({ title: '请填写收货人姓名！', icon: 'none' });
      return;
    }
    if (!member.mobile) {
      wx.showToast({ title: '请填写手机号！', icon: 'none' })
      return;
    }
    msgDlg.showLoading('正在提交中...');
    let $this = this
    orderService.toPayConfirm({
      data: { sumPayPrice: $this.data.sumPrice, memId: member.id },
      success: function (res) {
        console.log('toPayConfirm', res)
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
        } else {
          msgDlg.showModal('错误提示', res.state || res.data.state || '提交出错！', false)
        }
      },
      fail: function (res) {
        msgDlg.showModal('错误提示', res.state || res.data.state || '提交出错！', false)
      },
      complete: function (res) {
        msgDlg.hideLoading();
      }
    });
  },
  nameInput: function (e) {
    let member = this.data.member;
    member.nickname = e.detail.value;
  },
  mobileInput: function (e) {
    let member = this.data.member;
    member.mobile = e.detail.value;
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
    let addressInfo = wx.getStorageSync('address');
    this.setData({
      addressInfo: addressInfo
    })
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

  }
})