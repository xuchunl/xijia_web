var mobileService = require('../../apis/mobile/mobileService')
var cartService = require('../../apis/cart/cartService')
var msgDlg = require('../../utils/msgDlg')
var storage = require('../../utils/storage')
var moment = require('../../utils/moment')
var huxingService = require('../../apis/huxing/huxingService')
var fenggeService = require('../../apis/fengge/fenggeService')
import MD5 from '../../utils/md5.js'
const app = getApp()
Page({
  data: {
    id: '',
    urlPrefix: app.globalData.baseUrl,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().screenHeight,
    scrollLeft: 0, //tab标题的滚动条位置
    currentTab: 0,
    currentIndex: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    num:1,
    videoUrl: '',
    style: 0,
    currentSize: null,
    modalHidden: true,
    detailInfo: {},
    currentCate: {},
    productType: null,
    videoStatus: false,
    guiGeStatus: false,
    autoplayStatus: true,
    hxDetail: {},
    user: { userName: null, mobile: null, houseType: null,fengeId: null },
    userNameFocus: false,
    mobileFocus: false,
    houseTypeFocus: false,
    pintuanStatus: false,
    cartStatus: false,
    productList: [],
    productDetailList: [],
    shoppingInfo: [],
    totalMny: 0,
    showGuiGeInfo: [],
    interval: 5000,
    currentShopping: { goodsId: null, guigeIds: null, price: null, num: 1, total: 0, ciimgUrl: null, name: null, count: 0, guigeName: null, cartGoodsList: [] }, // 当前选中的商品信息
    shoppingCarList: [], // 购物车的商品信息
    shoppingList:[], // 选中所有的商品信息
    goodsId: '',
    cateList:[],
    hxList: [],
    fgList: [],
    hxIndex: '',
    fgIndex: '',
    loading: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    msgDlg.showLoading('正在加载中');
    let id = id = options ? options.id : ''
    let member = wx.getStorageSync('member') || {};
    this.setData({ userInfo: member })
    if (id) this.loadData(id);
    this.loadHXList();
    this.loadFGList();
  },
  loadData: function (id) {
    let fengeDetail = storage.getSync('fenge-detail');
    if (fengeDetail) {
      this.setData({ detailInfo: fengeDetail, videoUrl: fengeDetail.livingVideo, productList: fengeDetail.goodsList });
      let huDetail = storage.getSync('hx-detail-' + hxInfo.data.id)
      if (huDetail) this.setData({ hxDetail: huDetail });
      else this.queryHX(fengeDetail.huxingId);
    } else {
      mobileService.details({
        data: {id: id},
        success: (res) => {
          if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
            res.data.info = [];
            res.data.info.push({ price: res.data.tg10Price, num :1})
            res.data.info.push({ price: res.data.tg20Price, num: 2 })
            res.data.info.push({ price: res.data.tg30Price, num: 3 })
            res.data.info.push({ price: res.data.tg40Price, num: 4 })
            res.data.info.push({ price: res.data.tg50Price, num: 5 })
            res.data.showImages = [];
            res.data.showImages.push(this.data.urlPrefix + res.data.livingRoom);
            res.data.showImages.push(this.data.urlPrefix + res.data.diningRoom);
            res.data.showImages.push(this.data.urlPrefix + res.data.bedroom);
            res.data.showImages.push(this.data.urlPrefix + res.data.secondaryRoom);
            res.data.showImages.push(this.data.urlPrefix + res.data.functionRoom);
            res.data.showImages.push(this.data.urlPrefix + res.data.veranda);
            res.data.goodsList.filter(item => item.changeNum = item.num)
            this.setData({ detailInfo: res.data, videoUrl: res.data.livingVideo, productList: res.data.goodsList });
            this.findCatelist();
            let time = new Date(moment(new Date).add(1, 'd')).getTime()
            // storage.setSync('fenge-detail', res.data, time)
            this.queryHX(res.data.huxingId);
          } else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
        },
        fail: (res) => {
          msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
        },
        complete: (res) => {
          msgDlg.hideLoading();
        }
      });
    }
  },
  // 通过id查询户型信息
  queryHX: function(id) {
    let time = new Date(moment(new Date).add(1, 'd')).getTime()
    mobileService.queryHx({
      data: { id: id },
      success: (hxInfo) => {
        if (hxInfo.data && (!hxInfo.data.msg || hxInfo.data.msg !== 'fail')) {
          this.setData({ hxDetail: hxInfo.data});
        } else msgDlg.showModal('错误提示', hxInfo.state || hxInfo.data.state || '查询出错！', false);
      },
      fail:　(hxInfo)　=> {
        msgDlg.showModal('错误提示', hxInfo.state || hxInfo.data.state || '查询出错！', false);
      },
      complete: (res) => {}
    })
  },
  // 查询类别列表
  findCatelist: function () {
    mobileService.findCatelist({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
          let list = res.data.filter(item => item.isLeaf);
          this.setData({ cateList: list, currentCate: list[0] || {} });
          this.handlePrice();
        } else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      complete: (res) => {}
    })
  },
  handlePrice: function () {
    let totalMny = 0;
    let cateList = this.data.cateList;
    let productList = this.data.productList;
    let currentCate = this.data.currentCate;
    let currentShopping = this.data.currentShopping;
    cateList.filter(item => {
      item.num = 0;
      item.price = 0;
      productList.filter(product => {
        if (product.cateId == item.id) {
          item.num = Number(item.num || 0) + Number(product.changeNum || 0);
          item.price = item.price +  Number(product.changeNum || 0) * Number(product.marketPrice || 0);
        }
        if (item.id === currentCate.id) currentCate.price = item.price;
      })
      totalMny += Number(item.price || 0);
      return true;
    })
    // 一套餐价格*数量
    totalMny = totalMny * currentShopping.num
    this.setData({
      cateList: cateList,
      totalMny: totalMny,
      productList: productList,
      currentCate: currentCate
    })
  },
  deProductNum: function (e) {
    let product = e.currentTarget.dataset.item;
    if (product.changeNum < 0) return;
    product.changeNum--;
    let productList = this.data.productList;
    productList.splice(productList.findIndex(item => item.id === product.id), 1, product);
    this.setData({ productList: productList });
    this.handlePrice();
  },
  addProductNum: function (e) {
    let product = e.currentTarget.dataset.item;
    if (product.changeNum >= product.num) return;
    product.changeNum++;
    let productList = this.data.productList;
    productList.splice(productList.findIndex(item => item.id === product.id), 1, product);
    this.setData({ productList: productList });
    this.handlePrice();
  },
  loadHXList: function () {
    huxingService.queryList({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) this.setData({ hxList: res.data })
        else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    })
  },
  loadFGList: function () {
    fenggeService.queryList({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) this.setData({ fgList: res.data });
        else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    })
  },
  nameInput: function (e) {
    let sub = this.data.user;
    sub.userName = e.detail.value;
  },
  mobileInput: function (e) {
    let sub = this.data.user;
    sub.mobile = e.detail.value;
  },
  bindHX: function (e) {
    let hx = ''
    if (this.data.hxList && this.data.hxList.length) hx = this.data.hxList[e.detail.value].id;
    let user = this.data.user
    user.houseType = hx;
    this.setData({ hxIndex: e.detail.value, user: user });
  },
  bindFG: function (e) {
    let fenggeId = ''
    if (this.data.fgList && this.data.fgList.length) fenggeId = this.data.fgList[e.detail.value].id;
    let user = this.data.user
    user.fenggeId = fenggeId;
    this.setData({ fgIndex: e.detail.value, user: user });
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({ userInfo: e.detail.userInfo, hasUserInfo: true });
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
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {}
    return {
      title: '分享',
      imageUrl: '../image/post2.jpg',//图片地址
      path: '/pages/index/index?jump=123',// 用户点击首先进入的当前页面
      success: function (res) {},
      fail: (res) => {}
    }
  },
  bindViewTap: function () {
    wx.navigateTo({ url: '../shopping/index'})
  },
  switchTab: function (e) {
    this.setData({ currentIndex: e.detail.current});
  },
  switchTabFinish: function(e) {},
  swichNav: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.current) return false;
     else {
      this.setData({
        currentIndex: e.currentTarget.dataset.current,
        autoplayStatus: false,
        currentTab: e.currentTarget.dataset.current,
      })
      setTimeout(() => {
        this.setData({ autoplayStatus: true})
      },5000)
    }
  },
  clickCate: function(e){
    let id = e.currentTarget.dataset.id;
    let currentCate = e.currentTarget.dataset.cate;
    this.setData({ currentCate: currentCate});
  },
  closeShowShopping: function () {
    this.setData({ guiGeStatus: false})
  },
  /**
   * 显示规格
   */
  showAddView(e) {
    var addIconPopover = !this.data.popoverIsShow.addIconPopover;
    this.setData({
      popoverIsShow: { addIconPopover: addIconPopover }
    });
  },
  /**
   * 隐藏规格
   */
  hideAddView(e) {
    var addIconPopover = !this.data.popoverIsShow.addIconPopover;
    this.setData({
      popoverIsShow: {
        addIconPopover: addIconPopover,
      },
      currentSize: null,
    })
  },
  deNum(e) {
    let currentShopping = this.data.currentShopping || {};
    if (currentShopping.num > 1) currentShopping.num--;
    else currentShopping.num = 1;
    this.setData({ currentShopping: currentShopping});
    this.handlePrice();
  },
  addNum(e) {
    let currentShopping = this.data.currentShopping || {};
    currentShopping.num++;
    this.setData({ currentShopping: currentShopping });
    this.handlePrice();
  },
  changeCartNum(e) {
    let num = e.detail.value || 1;
    let currentShopping = this.data.currentShopping || {};
    if (num && num > 1) currentShopping.num = num;
    else currentShopping.num = 1;
    this.setData({ currentShopping: currentShopping })
    this.handlePrice();
  },
  bindVideoTab: function() {
    let videoStatus = !this.data.videoStatus;
    if (videoStatus) {
      if (this.data.currentTab ==0) {
        let videoUrl = this.data.detailInfo.livingVideo
        this.setData({ videoUrl: videoUrl });
      } else if (this.data.currentTab == 1) {
        let videoUrl = this.data.detailInfo.diningVideo
        this.setData({ videoUrl: videoUrl });
      } else if (this.data.currentTab == 2) {
        let videoUrl = this.data.detailInfo.bedVideo
        this.setData({ videoUrl: videoUrl });
      } else if (this.data.currentTab == 3) {
        let videoUrl = this.data.detailInfo.secondaryVideo
        this.setData({ videoUrl: videoUrl });
      } else if (this.data.currentTab == 4) {
        let videoUrl = this.data.detailInfo.functionVideo
        this.setData({ videoUrl: videoUrl });
      }
      else if (this.data.currentTab == 5) {
        let videoUrl = this.data.detailInfo.verandaVideo
        this.setData({ videoUrl: videoUrl });
      }
    }
    this.setData({ videoStatus: videoStatus, autoplayStatus: !videoStatus });
  },
  closeVideo: function() {
    let videoStatus = !this.data.videoStatus;
    this.setData({ videoStatus: videoStatus, autoplayStatus: !videoStatus });
  },
  preventTouchMove() {},
  // 选详情规格事件
  clickType(e) {
    let goodsId = this.data.goodsId;
    let guigeId = e.currentTarget.dataset.guigeid;
    let guigeName = e.currentTarget.dataset.guigename;
    this.findGoods(guigeId, goodsId, guigeName)
  },
  // 根据选择商品规格后， 查询出商品相应规格的相关信息
  findGoods: function (guigeId, goodsId, guigeName) {
    let currentShopping = this.data.currentShopping || {};
    let shoppingList = this.data.shoppingList || [];
    let index = null;
    let shopping = {};
    shoppingList.forEach((item, itemIndex) => {
      if (item.goodsId === goodsId) {
        if (!item.guigeIds) {
          shopping = item;
          index = itemIndex;
        } else if (item.guigeIds === guigeId) {
          shopping = item;
          index = itemIndex;
        }
        return;
      }
    })
    mobileService.findByIds({
      data: { goodsId: goodsId, guigeId: guigeId },
      success: (result) => {
        if (result.data && (!result.data.msg || result.data.msg !== 'fail')) {
          if (shopping && shopping.goodsId) {
            shopping.guigeIds = guigeId;
            shopping.price = result.data.price
            shopping.total = Number(result.data.price) * Number(shopping.num)
            shopping.count = result.data.num;
            shopping.ciimgUrl = result.data.gimgUrl;
            shopping.guigeName = guigeName;
            currentShopping = shopping;
            shoppingList[index] = shopping
          } else {
            let total = Number(result.data.price) * 1
            currentShopping = { goodsId: goodsId, guigeIds: guigeId, price: result.data.price, num: 1, total: total, ciimgUrl: currentShopping.ciimgUrl, name: currentShopping.name, count: currentShopping.count, guigeName: guigeName };
            shoppingList.push(currentShopping)
          }
          console.log('e', currentShopping)
          this.setData({ currentShopping: currentShopping, shoppingList: shoppingList });
          let time = new Date(moment(new Date).add(1, 'd')).getTime()
        } else msgDlg.showModal('错误提示', result.data || result.data.state || '查询信息不存在！', false);
      },
      fail: function (result) {
        msgDlg.showModal('错误提示', result.data || result.data.state || '查询出错！', false);
      },
      complete: function (result) {}
    })
  },
  // 添加到购物车
  addShoppingCar(e) {
    this.setData({ loading: true});
    let currentShopping = this.data.currentShopping || {};
    if (!Number(currentShopping.num)) return wx.showToast({ title: '数量有误！', icon: 'none' });
    let member = wx.getStorageSync('member');
    let cartGoodsList = this.data.productList.map(item => {
      return {
        goods: {id: item.id},
        fgPosition: {id: this.data.detailInfo.id},
        cate: { id: item.cateId },
        num: item.changeNum,
        price: item.marketPrice,
        totalMny: item.totalMny
      }
    });
    let data = {
      fgPosition: { id: this.data.detailInfo.id, name: this.data.detailInfo.name },
      fgPositionId: this.data.detailInfo.id,
      fgPositionName: this.data.detailInfo.name,
      memId: member.id,
      num: currentShopping.num,
      cartGoodsList: cartGoodsList,
      goodsId: this.data.detailInfo.goodsId,
      ciimgUrl: this.data.detailInfo.preImg,
      price: this.data.totalMny / currentShopping.num
    }
    cartService.saveCart({
      data: data,
      success: function (result) {
        if (result.data && (!result.data.msg || result.data.msg === 'success')) {
          wx.showToast({ title: '添加成功！', icon: 'success' })
        } else msgDlg.showModal('错误提示', result.state || result.data.state || '添加购物车出错！', false)
      },
      fail: (result) => {
        msgDlg.showModal('错误提示', result.state || result.data.state || '添加购物车出错！', false)
      },
      complete: (result) => {
        this.setData({ loading: false });
       }
    })
  },
  /**
   * 显示拼团信息
   */
  onPintuan: function() {
    this.setData({ pintuanStatus: !this.data.pintuanStatus});
  },
  onMask: function (e) {
    this.setData({ pintuanStatus: false, cartStatus: false});
  },
  /**
   * 点击选规格事件
   */
  clickShowShopping: function(e) {
    msgDlg.showLoading('正在加载中');
    let guiGeStatus = this.data.guiGeStatus;
    let currentShopping = this.data.currentShopping;
    if (!this.data.guiGeStatus) {
      let detail = e.currentTarget.dataset.product || {};
      let shoppingList = this.data.shoppingList || [];
      let index = null;
      let shopping = {};
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === detail.id) {
          if (currentShopping.goodsId === item.goodsId && currentShopping.guigeIds)
          index = itemIndex;
          shopping = item;
          shopping.ciimgUrl = detail.imgMobileUrl;
          shopping.count = detail.num;
          shopping.name = detail.name;
          return;
        }
      })
      this.setData({ goodsId: detail.id})
      mobileService.detailOfGoods({
        data: { id: detail.id },
        success:(result) => {
          if (result.data && (!result.data.msg || result.data.msg !== 'fail')) {
            if (shopping && shopping.goodsId) {
              let tempGuiGeList = result.data[0].giList[0].subItemList.filter((item) => item.id === shopping.guigeIds)
              if (tempGuiGeList && tempGuiGeList.length > 0) {
                currentShopping = { goodsId: detail.id, guigeIds: shopping.guigeIds, price: shopping.price, num: shopping.num, total: shopping.total, ciimgUrl: shopping.ciimgUrl, count: shopping.count };
                shoppingList[index] = currentShopping;
              } else {
                currentShopping = { goodsId: detail.id, guigeIds: null, price: 0, num: currentShopping.num, total: 0, ciimgUrl: detail.imgMobileUrl, name: detail.name, count: detail.num }
              }
            } else {
              currentShopping = { goodsId: detail.id, guigeIds: null, price: 0, num: 1, total: 0, ciimgUrl: detail.imgMobileUrl, name: detail.name, count: detail.num }
              shoppingList.push(currentShopping);
            }
            console.log('currentShopping', currentShopping)
            this.setData({
              currentShopping: currentShopping,
              shoppingList: shoppingList,
              showGuiGeInfo: result.data,
              guiGeStatus: !guiGeStatus
            })
          } else msgDlg.showModal('错误提示', result.data || result.data.state || '查询出错！', false);
        },
        fail: (result) => {
          msgDlg.showModal('错误提示', result.data || result.data.state || '查询出错！', false);
        },
        complete: (result) => {
          msgDlg.hideLoading();
        }
      })
    }
  },
  clickShowImage: function(e) {
    let url = this.data.urlPrefix + this.data.hxDetail.bigImgUrl
    let urls = []
    urls.push(url)
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls || [] // 需要预览的图片http链接列表
    })
  },
  pintuanTouchMove: function () { },
  bindFocus: function (e) {
    let value = e.currentTarget.dataset.value;
    if (value === 'userName') this.setData({ userNameFocus: true });
    if (value === 'mobile') this.setData({ mobileFocus: true });
    if (value === 'houseType') this.setData({ houseTypeFocus: true });
  },
  bindBlur: function (e) {
    let value = e.currentTarget.dataset.value;
    if (value === 'userName') this.setData({ userNameFocus: false });
    if (value === 'mobile') this.setData({ mobileFocus: false });
    if (value === 'houseType') this.setData({ houseTypeFocus: false });
  },
  onBuy: function () {
    let currentShopping = this.data.currentShopping || {};
    if (!Number(currentShopping.num)) return wx.showToast({ title: '数量有误！', icon: 'none' });
    let member = wx.getStorageSync('member');
    let cartGoodsList = this.data.productList.map(item => {
      return {
        goods: { id: item.id, name: item.name },
        fgPosition: { id: this.data.detailInfo.id },
        cate: { id: item.cateId },
        num: item.changeNum,
        price: item.marketPrice,
        totalMny: item.totalMny,
        name: item.name
      }
    });
    let data = {
      fgPosition: { id: this.data.detailInfo.id, name: this.data.detailInfo.name },
      fgPositionId: this.data.detailInfo.id,
      fgPositionName: this.data.detailInfo.name,
      name: this.data.detailInfo.name,
      memId: member.id,
      num: currentShopping.num,
      cartGoodsList: cartGoodsList,
      goodsId: this.data.detailInfo.goodsId,
      ciimgUrl: this.data.detailInfo.preImg,
      price: this.data.totalMny / currentShopping.num,
      isNow: true,
      fgPositionId: this.data.detailInfo.id
    }
    wx.setStorageSync("goodsList", [data]);
    wx.navigateTo({ url: '../settle/settle?pageType=mobile&isNow=' + true});
  },
  /* 支付 */
  wxpay1: function () {
    let user = this.data.user;
    if (!user || !user.userName) {
      wx.showToast({ title: '请填写姓名！', icon: 'none' })
      return
    }
    if (!user || !user.mobile) {
      wx.showToast({ title: '请填写电话！', icon: 'none' })
      return
    } else if (user.mobile) {
      // 判断手机格式是否正确
    }
    if (!user || !user.houseType || !user.fenggeId) {
      wx.showToast({ title: '请选择户型或选择风格！', icon: 'none' })
      return
    }
    msgDlg.showLoading('正在支付中...');
    let loginInfo = wx.getStorageSync('loginInfo');
    if (loginInfo) {
      this.wxpay(loginInfo.code);
    }
  },
  /* 获取openId */
  getOpenId: function (code) {
    var that = this
    wx.request({
      url: "https://api.weixin.qq.com/sns/jscode2session?appid=wxbd5a8270399d41d9&secret=d8aac26a5a9c16266d1a23851ebb7d9b&js_code=" + code + "&grant_type=authorization_code",
      method: 'GET',
      success: function (res) {
        //统一支付签名
        var appid = '';//appid  
        var body = '';//商户名
        var mch_id = '';//商户号  
        var nonce_str = that.randomString;//随机字符串，不长于32位。  
        var notify_url = '';//通知地址
        var spbill_create_ip = '';//ip
        // var total_fee = parseInt(that.data.wxPayMoney) * 100;
        var total_fee = 100;
        var trade_type = "JSAPI";
        var key = '';
        var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '¬ify_url=' + notify_url + '&openid=' + res.data.openid + '&out_trade_no=' + that.data.paySn + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
        var sign = MD5.MD5(unifiedPayment).toUpperCase()
        console.log(sign)
        //封装统一支付xml参数
        var formData = "<xml>"
        formData += "<appid>" + appid + "</appid>"
        formData += "<body>" + body + "</body>"
        formData += "<mch_id>" + mch_id + "</mch_id>"
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"
        formData += "<notify_url>" + notify_url + "</notify_url>"
        formData += "<openid>" + res.data.openid + "</openid>"
        formData += "<out_trade_no>" + that.data.paySn + "</out_trade_no>"
        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
        formData += "<total_fee>" + total_fee + "</total_fee>"
        formData += "<trade_type>" + trade_type + "</trade_type>"
        formData += "<sign>" + sign + "</sign>"
        formData += "</xml>"
        //统一支付
        wx.request({
          url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
          method: 'POST',
          head: 'application/x-www-form-urlencoded',
          data: formData, // 设置请求的 header
          success: function (res) {
            console.log(res.data)
            var result_code = that.getXMLNodeValue('result_code', res.data.toString("utf-8"))
            var resultCode = result_code.split('[')[2].split(']')[0]
            if (resultCode == 'FAIL') {
              var err_code_des = that.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
              var errDes = err_code_des.split('[')[2].split(']')[0]
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
                success: function (res) {
                  wx.showToast({
                    title: errDes,
                    icon: 'success',
                    duration: 2000
                  })
                },

              })
            } else {
              //发起支付
              var prepay_id = that.getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
              var tmp = prepay_id.split('[')
              var tmp1 = tmp[2].split(']')
              //签名  
              var key = '';
              var appId = '';
              var timeStamp = that.createTimeStamp();
              var nonceStr = that.randomString();
              var stringSignTemp = "appId=&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key="
              var sign = MD5.MD5(stringSignTemp).toUpperCase()
              console.log(sign)
              var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + tmp1[0], "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
              that.pay(param)
            }
          },
        })
      },
      fail: () => {}
    })
  },
  paysignjsapi: function (appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
    var key = this.data.key;
    var ret = {
      appid: appid,
      body: body,
      mch_id: mch_id,
      nonce_str: nonce_str,
      notify_url: notify_url,
      openid: openid,
      out_trade_no: out_trade_no,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: trade_type
    }
    var str = this.raw(ret)
    str = str + '&key=' + key
    return MD5(str).toUpperCase()
  },
  /* 微信支付 */
  wxpay: function () {
    let member = wx.getStorageSync('member')
    let loginInfo = wx.getStorageSync('loginInfo')
    let user = this.data.user;
    if (!user || !user.userName) {
      wx.showToast({ title: '请填写姓名！', icon: 'none' })
      return
    }
    if (!user || !user.mobile) {
      wx.showToast({ title: '请填写电话！', icon: 'none' })
      return
    } else if (user.mobile) {
      // 判断手机格式是否正确
    }
    if (!user || !user.houseType || !user.fenggeId) {
      wx.showToast({ title: '请选择户型或选择风格！', icon: 'none' })
      return
    }
    msgDlg.showLoading('正在支付中...');
    var that = this
    //统一支付签名
    var bookingNo = 'zx' + new Date().getTime();
    var openid = loginInfo.mini_openid;
    var appid = 'wxcb57e518cc7c5fc0';//appid  
    var body = '深圳市兆禧软装装饰有限公司';//商户名
    var mch_id = '1488648672';//商户号  
    var nonce_str = that.randomString();//随机字符串，不长于32位。  
    var spbill_create_ip = '';//ip
    // var total_fee = parseInt(that.data.wxPayMoney) * 100;
    var total_fee = 1;
    var timeStamp = new Date().getTime();
    var notify_url = 'http://www.weixin.qq.com/wxpay/pay.php';
    var trade_type = "JSAPI";
    var key = this.data.key;

    // var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"
    var formData = "<xml>"
    formData += "<appid>" + appid + "</appid>" //appid  
    formData += "<body>" + body + "</body>"
    formData += "<mch_id>" + mch_id + "</mch_id>" //商户号  
    formData += "<nonce_str>" + nonce_str + "</nonce_str>" //随机字符串，不长于32位。  
    formData += "<notify_url>" + notify_url + "</notify_url>"
    formData += "<openid>" + openid + "</openid>"
    formData += "<out_trade_no>" + 'zx' + timeStamp + "</out_trade_no>"
    formData += "<spbill_create_ip>61.50.221.43</spbill_create_ip>"
    formData += "<total_fee>" + total_fee + "</total_fee>"
    formData += "<trade_type>" + trade_type + "</trade_type>"
    formData += "<sign>" + this.paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, bookingNo, '61.50.221.43', total_fee, trade_type) + "</sign>"
    formData += "</xml>"

    //统一支付
    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: 'POST',
      head: 'application/x-www-form-urlencoded',
      data: formData, // 设置请求的 header
      success: function (res) {
        if (res.data && res.data.indexOf('FAIL') != -1) {
          msgDlg.showModal('系统提示', res.data, false)
          return;
        }
        var result_code = that.getXMLNodeValue('result_code', res.data.toString("utf-8"))
        var resultCode = result_code.split('[')[2].split(']')[0]
        if (resultCode == 'FAIL') {
          msgDlg.showModal('resultCode FAIL', resultCode, false)
          var err_code_des = that.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
          var errDes = err_code_des.split('[')[2].split(']')[0]
          msgDlg.showToast(errDes);
        } else {
          //发起支付
          var prepay_id = that.getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
          var tmp = prepay_id.split('[')
          var tmp1 = tmp[2].split(']')
          // var appId = appid;
          var time = that.createTimeStamp();
          var nonceStr = that.randomString();
          var stringSignTemp = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + time + "&key=" + key
          var sign = MD5(stringSignTemp).toUpperCase()
          console.log(sign)
          var param = { "timeStamp": time, "package": 'prepay_id=' + tmp1[0], "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
          that.pay(param)
        }
      },
      fail: () => {
        msgDlg.showModal('系统提示', '调用下单失败：' + res.data, false)
      }
    })
  },
  /* 随机数 */
  randomString: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 获取prepay_id */
  getXMLNodeValue: function (node_name, xml) {
    var tmp = xml.split("<" + node_name + ">")
    var _tmp = tmp[1].split("</" + node_name + ">")
    return _tmp[0]
  },
  /* 时间戳产生函数   */
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  /* 支付   */
  pay: function (param) {
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log(res)
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: () => {}
        })
      },
      fail: () => {
        console.log("支付失败")
      }
    })
  },
  previewImageOne: function(e) {
    let imageUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: [imageUrl] // 需要预览的图片http链接列表
    })
  },
  previewImage: function (e) {
    let images = e.currentTarget.dataset.images;
    let index = e.currentTarget.dataset.index || this.data.currentTab;
    wx.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  toViewVR: function(){
    wx.navigateTo({ url: '../webView/index?url=' + this.data.detailInfo.locationUrl });
  },
  onCartStatus : function () {
    this.setData({ cartStatus: !this.data.cartStatus});
  }
})