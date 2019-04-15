//获取应用实例
var mobileService = require('../../apis/mobile/mobileService')
var cartService = require('../../apis/cart/cartService')
var msgDlg = require('../../utils/msgDlg')
var storage = require('../../utils/storage')
var moment = require('../../utils/moment')
var huxingService = require('../../apis/huxing/huxingService')
var fenggeService = require('../../apis/fengge/fenggeService')
const app = getApp()
Page({
  data: {
    id: '',
    urlPrefix: 'https://www.onezxkj.com/hyht',
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
    cateId: null,
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
    productList: [],
    productDetailList: [],
    shoppingInfo: [],
    totalMny: 0,
    showGuiGeInfo: [],
    interval: 5000,
    currentShopping: { goodsId: null, guigeIds: null, price: null, num: 1, total: 0, ciimgUrl: null, name: null, count: 0, guigeName: null }, // 当前选中的商品信息
    shoppingCarList: [], // 购物车的商品信息
    shoppingList:[], // 选中所有的商品信息
    goodsId: '',
    cateList:[],
    hxList: [],
    fgList: [],
    hxIndex: '',
    fgIndex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    msgDlg.showLoading('正在加载中');
    let id = id = options ? options.id : ''
    var $this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (id) this.loadData(id);
    this.findCatelist();
    this.loadHXList();
    this.loadFGList();
  },
  loadData: function (id) {
    let $this = this
    let fengeDetail = storage.getSync('fenge-detail');
    if (fengeDetail) {
      $this.setData({
        detailInfo: fengeDetail,
        videoUrl: fengeDetail.livingVideo,
        productList: fengeDetail.goodsList
      })
      let huDetail = storage.getSync('hx-detail-' + hxInfo.data.id)
      if (huDetail) {
        $this.setData({ hxDetail: huDetail})
      } else this.queryHX(fengeDetail.huxingId);
    } else {
      mobileService.details({
        data: {id: id},
        success: (res) => {
          if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
            res.data.info = []
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
            $this.setData({
              detailInfo: res.data,
              videoUrl: res.data.livingVideo,
              productList: res.data.goodsList
            })
            let time = new Date(moment(new Date).add(1, 'd')).getTime()
            // storage.setSync('fenge-detail', res.data, time)
            $this.queryHX(res.data.huxingId);
          } else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
        },
        fail: (res) => {
          msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
        },
        complete: (res) => {
          msgDlg.hideLoading();
        }
      });
    }
  },
  // 通过id查询户型信息
  queryHX: function(id) {
    let $this = this
    let time = new Date(moment(new Date).add(1, 'd')).getTime()
    mobileService.queryHx({
      data: { id: id },
      success: function (hxInfo) {
        if (hxInfo.data && (!hxInfo.data.msg || hxInfo.data.msg !== 'fail')) {
          $this.setData({ hxDetail: hxInfo.data})
          // storage.setSync('hx-detail-' + hxInfo.data.id, hxInfo.data, time)
        } else msgDlg.showModal('错误提示', hxInfo.state || hxInfo.data.state || '查询出错！', false)
      },
      fail:　(hxInfo)　=> {
        msgDlg.showModal('错误提示', hxInfo.state || hxInfo.data.state || '查询出错！', false)
      },
      complete: (res) => {}
    })
  },
  // 查询类别列表
  findCatelist: function () {
    msgDlg.showLoading('');
    mobileService.findCatelist({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
          let list = res.data.filter(item => item.isLeaf)
          this.setData({
            cateList: list,
            cateId: list[0].id
          })
        } else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false)
      },
      complete: (res) => {}
    })
  },
  loadHXList: function () {
    let $this = this
    huxingService.queryList({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) $this.setData({ hxList: res.data })
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
    let $this = this
    fenggeService.queryList({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) $this.setData({ fgList: res.data })
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
    if (this.data.hxList && this.data.hxList.length) hx = this.data.hxList[e.detail.value].id
    let user = this.data.user
    user.houseType = hx;
    this.setData({ hxIndex: e.detail.value, user: user })
  },
  bindFG: function (e) {
    let fenggeId = ''
    if (this.data.fgList && this.data.fgList.length) fenggeId = this.data.fgList[e.detail.value].id
    let user = this.data.user
    user.fenggeId = fenggeId;
    this.setData({ fgIndex: e.detail.value, user: user })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {}
    return {
      title: '分享',
      imageUrl: '../image/qindan_01.jpg',//图片地址
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
    var $this = this;
    if ($this.data.currentTab == e.currentTarget.dataset.current) return false;
     else {
      $this.setData({
        currentIndex: e.currentTarget.dataset.current,
        autoplayStatus: false,
        currentTab: e.currentTarget.dataset.current,
      })
      setTimeout(function () {
        $this.setData({ autoplayStatus: true})
      },5000)
    }
  },
  /**
   * 显示对话框
   */
  showModal: function (e) {
    var $this = this;
    if ($this.data.modalHidden) {
      $this.setData({ modalHidden: false})
    }
  },
  /**
   * 确认
   */
  modalBindconfirm: function () {
    var $this = this;
    //把Modal上的时间赋给一层页面
    $this.setData({ modalHidden: true})
  },
  /**
   * 取消
   */
  modalBindcancel: function () {
    var $this = this;
    //把一层页面的时间赋给Modal
    $this.setData({ modalHidden: true})
  },
  clickCate: function(e){
    let id = e.currentTarget.dataset.id;
    this.setData({ cateId: id})
  },
  closeShowShopping: function () {
    this.setData({ guiGeStatus: false})
  },
  /**
 * 购物车按钮点击事件
 */
  addIconTap1: function (e) {
    let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    let shoppingInfoList = this.data.shoppingInfo;
    let productDetail = {};
    let detailList = shoppingInfoList.filter(item => item.name === name 
        && item.type === type);
    if (detailList.length > 0) {
      productDetail = detailList[0];
      productDetail.count = productDetail.count + 1;
      productDetail.sumMny = productDetail.count * Number(productDetail.price);
    } else {
      productDetail = {};
      let product = this.data.productList.filter(item => item.name === name)[0];
      if (product && product.name) {
        productDetail = product.detailInfo.filter(item => item.type === type)[0];
        productDetail.count = 1;
        productDetail.sumMny = productDetail.count * Number(productDetail.price);
      }
    }
    if (shoppingInfoList && shoppingInfoList.length > 0 ) {
      if (detailList.length > 0 ) {
        // shoppingInfoList.push(productDetail);
      } else shoppingInfoList.push(productDetail);
    } else shoppingInfoList.push(productDetail);
    let total = 0;
    shoppingInfoList.filter(item => {
      total = item.sumMny + total;
    }) 
    this.setData({
      shoppingInfo: shoppingInfoList,
      totalMny: total
    })
  },
  /**
   * 显示规格
   */
  showAddView(e) {
    let $this = this;
    var addIconPopover = !$this.data.popoverIsShow.addIconPopover
    $this.setData({
      popoverIsShow: {
        addIconPopover: addIconPopover
      }
    })
  },
  /**
   * 隐藏规格
   */
  hideAddView(e) {
    let $this = this;
    var addIconPopover = !$this.data.popoverIsShow.addIconPopover
    $this.setData({
      popoverIsShow: {
        addIconPopover: addIconPopover,
      },
      currentSize: null,
    })
  },
  deNum(e) {
    let currentShopping = this.data.currentShopping || {};
    let shoppingCarList = this.data.shoppingCarList | [];
    let shoppingList = this.data.shoppingList || [];
    if (currentShopping.num > 1) {
      currentShopping.num = Number(currentShopping.num) - 1;
      currentShopping.total = Number(currentShopping.num) * currentShopping.price
    } else {
      currentShopping.num = 1;
      currentShopping.total = Number(currentShopping.num) * currentShopping.price
      return
    }
    // 查询当前商品信息和选中所有的商品信息
    if (currentShopping.guigeIds) {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && item.guigeIds === currentShopping.guigeIds) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    } else {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && !item.guigeIds) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    }
    this.setData({
      shoppingList: shoppingList,
      currentShopping: currentShopping
    })
  },
  addNum(e) {
    let currentShopping = this.data.currentShopping || {};
    let shoppingCarList =  this.data.shoppingCarList | [];
    let shoppingList = this.data.shoppingList || [] ;
    currentShopping.num = Number(currentShopping.num) + 1 ;
    currentShopping.total = Number(currentShopping.num) * currentShopping.price
    // 查询当前商品信息和选中所有的商品信息
    if (currentShopping.guigeIds) {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && item.guigeIds === currentShopping.guigeIds) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    } else {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && !item.guigeIds ) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    }
    this.setData({
      shoppingList: shoppingList,
      currentShopping: currentShopping
    })
  },
  changeNum(e) {
    let num = e.detail.value || 1;
    let currentShopping = this.data.currentShopping || {};
    let shoppingCarList = this.data.shoppingCarList | [];
    let shoppingList = this.data.shoppingList || [];
    if (num && num > 1) {
      currentShopping.num = num;
      currentShopping.total = Number(num) * currentShopping.price
    } else {
      currentShopping.num = 1;
      currentShopping.total = 1 * currentShopping.price
    }
    // 查询当前商品信息和选中所有的商品信息
    if (currentShopping.guigeIds) {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && item.guigeIds === currentShopping.guigeIds) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    } else {
      shoppingList.forEach((item, itemIndex) => {
        if (item.goodsId === currentShopping.goodsId && !item.guigeIds) {
          item.num = currentShopping.num
          item.total = Number(item.num) * item.price
          return;
        }
      });
    }
    this.setData({
      shoppingList: shoppingList,
      currentShopping: currentShopping
    })
  },
  bindVideoTab: function() {
    let videoStatus = !this.data.videoStatus;
    if (videoStatus) {
      if (this.data.currentTab ==0) {
        let videoUrl = this.data.detailInfo.livingVideo
        this.setData({
          videoUrl: videoUrl
        })
      } else if (this.data.currentTab == 1) {
        let videoUrl = this.data.detailInfo.diningVideo
        this.setData({
          videoUrl: videoUrl
        })
      } else if (this.data.currentTab == 2) {
        let videoUrl = this.data.detailInfo.bedVideo
        this.setData({
          videoUrl: videoUrl
        })
      } else if (this.data.currentTab == 3) {
        let videoUrl = this.data.detailInfo.secondaryVideo
        this.setData({
          videoUrl: videoUrl
        })
      } else if (this.data.currentTab == 4) {
        let videoUrl = this.data.detailInfo.functionVideo
        this.setData({
          videoUrl: videoUrl
        })
      }
      else if (this.data.currentTab == 5) {
        let videoUrl = this.data.detailInfo.verandaVideo
        this.setData({
          videoUrl: videoUrl
        })
      }
    }
    this.setData({
      videoStatus: videoStatus,
      autoplayStatus: !videoStatus
    })
  },
  closeVideo: function() {
    let videoStatus = !this.data.videoStatus;
    this.setData({
      videoStatus: videoStatus,
      autoplayStatus: !videoStatus
    })
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
    let $this = this;
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
      success: function (result) {
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
          $this.setData({
            currentShopping: currentShopping,
            shoppingList: shoppingList
          })
          let time = new Date(moment(new Date).add(1, 'd')).getTime()
        } else {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询信息不存在！', false)
        }
      },
      fail: function (result) {
        msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
      },
      complete: function (result) {
      }
    })
  },
  // 添加到购物车
  addShoppingCar(e) {
    let currentShopping = this.data.currentShopping || {};
    let shoppingCarList = this.data.shoppingCarList || [];
    let shoppingList = this.data.shoppingList || [];
    if (!currentShopping.guigeIds) {
      wx.showToast({
        title: '请选择规格！',  //标题
        icon: 'none'
      })
      return 
    } else {
      let shoppingFilterList = shoppingList.filter(item => item.goodsId === currentShopping.goodsId && item.guigeIds === currentShopping.guigeIds) || [];
      if (shoppingFilterList.length) {
        if (shoppingCarList && shoppingCarList.length ) {
          let shoppingCarFilterList = shoppingCarList.filter(item => {
            if (item.goodsId === currentShopping.goodsId && item.guigeIds === currentShopping.guigeIds){
              item.num = shoppingFilterList[0].num;
              item.total = shoppingFilterList[0].total;
              return true;
            }
          })
          if (!shoppingCarFilterList || !shoppingCarFilterList.length) {
            shoppingCarList.push(shoppingFilterList[0])
          }
        } else {
          shoppingCarList.push(shoppingFilterList[0])
        }
      }
    }
    let totalMny = 0;
    shoppingCarList.filter(item => {
      totalMny = item.total + totalMny
      return true
    })
    shoppingCarList.forEach(item => {
      cartService.saveCart({
        data: item,
        success: function (result) {
          // 返回数据，
          if (result.data && (!result.data.msg || result.data.msg === 'success')) {
            wx.showToast({
              title: '添加成功！',  //标题
              icon: 'success'
            })
          } elsemsgDlg.showModal('错误提示', result.state || result.data.state || '添加购物车出错！', false)
        },
        fail: (result) => {
          msgDlg.showModal('错误提示', result.state || result.data.state || '添加购物车出错！', false)
        },
        complete: function (result) {}
      })
    })
    this.setData({
      totalMny: totalMny,
      shoppingCarList: shoppingCarList
    })
  },
  /**
   * 显示拼团信息
   */
  clickPintuan: function (e) {
    this.setData({ pintuanStatus: !this.data.pintuanStatus})
  },
  /**
   * 点击选规格事件
   */
  clickShowShopping: function(e) {
    msgDlg.showLoading('正在加载中');
    let $this = this
    let guiGeStatus = this.data.guiGeStatus;
    let currentShopping = this.data.currentShopping;
    if (!this.data.guiGeStatus) {
      let detail = e.currentTarget.dataset.product || {};
      let shoppingList = $this.data.shoppingList || [];
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
        success: function (result) {
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
            $this.setData({
              currentShopping: currentShopping,
              shoppingList: shoppingList,
              showGuiGeInfo: result.data,
              guiGeStatus: !guiGeStatus
            })
          } else msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
        },
        fail: (result) => {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
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
    // {{urlPrefix}}{{hxDetail.bigImgUrl}}
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls || [] // 需要预览的图片http链接列表
    })
  },
  pintuanTouchMove: function () { },
  bindFocus: function (e) {
    let value = e.currentTarget.dataset.value;
    if (value === 'userName') {
      this.setData({ userNameFocus: true})
    }
    if (value === 'mobile') {
      this.setData({ mobileFocus: true})
    }
    if (value === 'houseType') {
      this.setData({ houseTypeFocus: true})
    }
  },
  bindBlur: function (e) {
    let value = e.currentTarget.dataset.value;
    if (value === 'userName') {
      this.setData({ userNameFocus: false})
    }
    if (value === 'mobile') {
      this.setData({ mobileFocus: false})
    }
    if (value === 'houseType') {
      this.setData({ houseTypeFocus: false})
    }
  },
  onBuy: function () {
    wx.setStorageSync("goodsList", [this.data.currentShopping])
    wx.navigateTo({ url: '../settle/settle?pageType=mobile'})
  },
  /* 支付 */
  wxpay: function () {
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
      this.getOpenId(loginInfo.code)
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
        // success
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
    wx.navigateTo({ url: '../webView/index?url=' + this.data.detailInfo.locationUrl })
  }
})