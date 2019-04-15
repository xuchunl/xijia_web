// pages/receiver/index.js
var receiverService = require('../../apis/receiver/receiverService')
var msgDlg = require('../../utils/msgDlg')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiverList: [],
    checkAddress: {},
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let $this = this
    let member = wx.getStorageSync('member')
    let id = options && options.id ? options.id : ''
    this.setData({
      id: id
    })
  },
  loadData: function () {
    let $this = this
    let id = this.data.id
    let member = wx.getStorageSync('member')
    console.log('member', member)
    if (!member || !member.id) {
      msgDlg.showModal('系统提示', '请先登录！', false)
      return;
    }
    msgDlg.showLoading('正在加载中');
    receiverService.queryList({
      data: { memId: member.id },
      success: function (res) {
        // 返回数据，进行赋值-receiverList
        console.log('queryList', res)
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
          if (id) {
            res.data.filter(item => {
              if (item.id == id) item.isCheck = true
            })
          }
          $this.setData({
            receiverList: res.data
          })
          console.log('receiverList', res.data);
        } else {
          msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
        }
      },
      fail: function (res) {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      complete: function (res) {
        msgDlg.hideLoading();
      }
    });
  },
  addAddress: function(e) {
    if (e.currentTarget.dataset.receiver) {
      wx.setStorageSync('receiver', e.currentTarget.dataset.receiver)
      wx.navigateTo({
        url: 'edit?pageType=edit',
      })
    } else {
      wx.navigateTo({
        url: 'edit',
      })
    }
  },
  clickCheck: function (e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let receiverList = this.data.receiverList
    receiverList[index].isCheck = !receiverList[index].isCheck
    this.setData({
      receiverList: receiverList,
      checkAddress: receiverList[index]
    })
  },
  checkAddress: function (e) {
    wx.setStorageSync('address', this.data.checkAddress)
    wx.navigateBack({})
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
    this.loadData()
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