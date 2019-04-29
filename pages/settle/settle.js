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
    receiver: {},
    isNow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member = wx.getStorageSync('member') 
    let goodsList = [];
    let sumPrice = 0
    goodsList = wx.getStorageSync("goodsList");
    if (options.pageType) {
      if (options.pageType == "mobile") {
      } else if (options.pageType == "goodsList") {
      }
    }
    goodsList.filter(item => {
      sumPrice = Number(item.price) * Number(item.num) + sumPrice;
      item.totalMny = Number(item.price) * Number(item.num);
    });
    this.setData({
      goodsList: goodsList,
      sumPrice: sumPrice,
      member: member,
      isNow: options.isNow || false
    })
  },
  checkAddress: function(){
    wx.navigateTo({
      url: '../receiver/index?id=' + this.data.addressInfo.id,
    })
  },
  onSubmit: function () {
    let member = this.data.member;
    let loginInfo = wx.getStorageSync("loginInfo");
    if (!member.nickname) {
      wx.showToast({ title: '请填写收货人姓名！', icon: 'none' });
      return;
    }
    if (!member.mobile) {
      wx.showToast({ title: '请填写手机号！', icon: 'none' })
      return;
    }
    msgDlg.showLoading('正在提交中...');
    orderService.toPayConfirm({
      data: {
        sumPayPrice: this.data.sumPrice,
        memId: member.id,
        mini_appid: loginInfo.mini_appid || app.globalData.appId,
        mini_openid: loginInfo.mini_openid || app.globalData.appId,
        mini_access_token: loginInfo.mini_access_token,
        receName: member.nickname,
        receAddr: member.receAddr || '广州市番禺区XXXX',
        receMobile: member.mobile,
        isNow: this.data.isNow,
        fgPositionId: '',
        wpBean: {
          appId: loginInfo.wpBean.appId,
          nonceStr: loginInfo.wpBean.nonceStr,
          timeStamp: loginInfo.wpBean.timeStamp
        }
      },
      success: (res) => {
        console.log('toPayConfirm', res)
        if (res.data && (res.data.msg && res.data.msg !== 'fail')) {
          let brandWCPayBean = res.data.brandWCPayBean || {};
          let orderitemList = [];
          let ids = '';
          this.data.goodsList.map(goods => {
            let orderItem = {
              fgPositionId: goods.fgPositionId,
              goods: { id: goods.goodsId},
              name: goods.name,
              num: goods.num,
              price: goods.price,
              xiaoji: goods.totalMny,
              remarks: ""
            }
            goods.cartGoodsList.filter(cartGoods => {
              let item = "";
              item = " " + cartGoods.name + "：" + cartGoods.price + "  " + cartGoods.num + "  " + cartGoods.totalMny + "\n"
              orderItem.remarks += orderItem.remarks+item;
            })
            orderitemList.push(orderItem);
            ids += (ids ? ',' : '') + goods.id;
          })
          orderService.payConfirmWfkSave({
            data: Object.assign({
              out_trade_no: res.data.out_trade_no,
              memId: res.data.memId,
              isTuan: res.data.isTuan,
              receName: res.data.receName,
              receAddr: res.data.receAddr,
              receMobile: res.data.receMobile,
              sumPayPrice: this.data.sumPrice,
              fgPositionId: res.data.fgPositionId,
              isNow: res.data.isNow,
              orderitemList: orderitemList,
              ids: ids
            }) ,
            success: (res) => {
              wx.requestPayment({
                timeStamp: brandWCPayBean.timeStamp,
                nonceStr: brandWCPayBean.nonceStr,
                package: brandWCPayBean.packageStr,
                signType: brandWCPayBean.signType,
                paySign: brandWCPayBean.paySign,
                success: function (res) {
                  console.log(res)
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function (res) {
                      // 保存订单：成功
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                      })
                    },
                    fail: () => {
                      msgDlg.showModal('错误提示', res.data || res.data.data || res.data.state || '提交出错！', false)
                     }
                  })
                },
                fail: (err) => {
                  // 保存订单：未支付
                  console.log("支付失败")
                }
              })
            },
            fail: (err) => {}
          })
        } else msgDlg.showModal('错误提示', res.data || res.data.data || res.data.state || '提交出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.data || res.data.data || res.data.state || '提交出错！', false)
      },
      complete: (res) => {
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