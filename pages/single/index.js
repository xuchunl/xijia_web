var brandService = require('../../apis/brand/brandService')
var mobileService = require('../../apis/mobile/mobileService')
var msgDlg = require('../../utils/msgDlg')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    urlPrefix: app.globalData.baseUrl,
    taocanList: [],
    scrollLeft: 0,
    currentTab: 0,
    houseInfo: [
      { num: 1, price: 500 },
      { num: 50, price: 300 }
    ],
    shareVisible: false,
    condition: {
      brandId: '',
      searchCondition: null
    },
    cateList: [],
    cateId: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../shopping/index'
    })
  },
  onLoad: function () {
    this.loadData();
    this.findCatelist()
  },
  // 加载数据
  loadData: function () {
    msgDlg.showLoading('正在加载中');
    brandService.brandGoodList({
      data: { mallBean: this.data.condition},
      success: (res)  =>{
        if (res.data && !res.data.message && res.data.msg != 'fail') {
          this.setData({ taocanList: res.data || []})
        } else msgDlg.showModal('错误提示', res.data.message || res.data.state || '查询出错！', false)
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || '查询出错！', false)
      },
      complete: function (res) {
        msgDlg.hideLoading();
      }
    });
  },
  // 查询类别列表
  findCatelist: function () {
    mobileService.findCatelist({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
          let list = res.data.filter(item => item.isLeaf);
          list.splice(0, 0, {name: '全部', id: 0})
          this.setData({ cateList: list,})
        } else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      complete: function (res) {}
    })
  },
  onShow: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    this.setData({ shareVisible: false });
    if (ops.from === 'button') {}
    return {
      title: '分享',
      imageUrl: '../image/post2.jpg',//图片地址
      path: '/pages/index/index?jump=123',// 用户点击首先进入的当前页面
      success: function (res) {},
      fail: function (res) {}
    }
  },
  onShareVisible: function (e) {
    var shareVisible = this.data.shareVisible;
    this.setData({ shareVisible: !shareVisible });
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  checkCor: function () {
    if (this.data.currentTab >= 4) {
      let x = (this.data.currentTab % 4) == 0 ? (this.data.currentTab / 4) * 250 : this.data.scrollLeft
      this.setData({ scrollLeft: x });
    } else this.setData({ scrollLeft: 0 });
  },
  swichNav: function (e) {
    if (this.data.currentTab === e.currentTarget.dataset.current) return false;
    else this.setData({ currentTab: e.currentTarget.dataset.current })
    this.checkCor();
    let condition = this.data.condition;
    condition.cateId = e.currentTarget.dataset.id;
    this.setData({ condition: condition })
    this.loadData()
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '../brand/detail?id=' + e.currentTarget.dataset.product.id
    })
  },
  toBrand: function(e) {
    let product = e.currentTarget.dataset.product
    console.log('product', product)
    wx.navigateTo({
      url: '../brand/index?brandId=' + (product.shopBrandId || ''),
    })
  },
  toBuyUser: (e) => {
    console.log(e);
    wx.navigateTo({
      url: '../brand/buy-detail?brandId=',
    })
  }
})
