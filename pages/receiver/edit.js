var msgDlg = require('../../utils/msgDlg')
var receiverService = require('../../apis/receiver/receiverService')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    receiver: {
      name: "",
      address: "",
      mobile: "",
      memId: '',
      isDel: false,
      isDefault: false,
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageType && options.pageType === 'edit') {
      let receiver = wx.getStorageSync('receiver')
      console.log('receiver', receiver)
      this.setData({ receiver: receiver });
    }
  },
  save: function() {
    let $this = this
    let receiver = this.data.receiver
    let addressInfo = wx.getStorageSync('address');
    if (!receiver.name) {
      msgDlg.showToast('请输入收货人！');
      return
    }
    if (!receiver.mobile) {
      msgDlg.showToast('请输入手机号！');
      return
    }
    if (!receiver.address) {
      msgDlg.showToast('请输入地址！');
      return
    }
    let member = wx.getStorageSync('member') || {}
    receiver.memId = member.id
    msgDlg.showLoading('正在保存中');
    receiverService.saveReceiver({
      data: receiver,
      success: (res) => {
        console.log('saveReceiver', res)
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
          console.log('save-address', res.data)
          if (receiver.id && receiver.id == addressInfo.id) {
            wx.setStorageSync('address', receiver)
          }
          msgDlg.showToast('保存成功！');
          wx.navigateBack({})
        } else msgDlg.showModal('错误提示', res.data || res.data.state || '保存出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.data || res.data.state || '保存出错！', false)
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    });
  },
  deleteReceiver: function () {
    let addressInfo = wx.getStorageSync('address');
    let receiver = this.data.receiver
    if (receiver.id && receiver.id == addressInfo.id) {
      msgDlg.showToast('当前地址已选中，不能删除！');
      return false;
    }
    msgDlg.showModal('操作提示', '确认要删除', true, function (res) {
      if (res.confirm) {
        console.log('confirm')
      }
    })
  },
  changeName: function (e) {
    let name = e.detail.value
    let receiver = this.data.receiver
    receiver.name = name
    this.setData({ receiver: receiver });
  },
  changeMobile: function (e) {
    let mobile = e.detail.value
    let receiver = this.data.receiver
    receiver.mobile = mobile
    this.setData({ receiver: receiver });
  },
  changeAddress: function (e) {
    let address = e.detail.value
    let receiver = this.data.receiver
    receiver.address = address
    this.setData({ receiver: receiver });
  },
  clickCheck: function() {
    let receiver = this.data.receiver
    receiver. isDefault = !receiver. isDefault
    this.setData({ receiver: receiver });
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
  onShareAppMessage: function () {}
})