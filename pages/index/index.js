var indexService = require('../../apis/index/indexService')
var msgDlg = require('../../utils/msgDlg')
var subscribeService = require('../../apis/subscribe/subscribeService')
var huxingService = require('../../apis/huxing/huxingService')
var fenggeService = require('../../apis/fengge/fenggeService')
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    urlPrefix: app.globalData.baseUrl,
    taocanList: [],
    currentCate: '0',
    cateList: [
      { id: 'all', name: '全部' },
      { id: 'modern', name: '现代'},
      { id: 'new', name: '新中' },
      { id: 'small', name: '小美' },
      { id: 'french', name: '法式' },
    ],
    shareVisible: false,
    postVisible: false,
    loginStatus: false,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().screenHeight,
    previewImageUrl: null,
    item: { name: '喜家', videoName: '大城' },
    winWidth: 0,
    winHeight: 0,
    canvasImagePath: null,
    advertiseStatus: false,
    subscribe: { name: null, phone: null, houseType: null, fenggeId: null },
    hxList: [],
    fgList: [],
    orderList: [],
    hxIndex: '',
    fgIndex: '',
  },
  bindViewTap: function () {
    wx.navigateTo({ url: '../shopping/index'})
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({ winWidth: res.windowWidth, winHeight: res.windowHeight });
      }
    })
    let member = wx.getStorageSync('member') || {};
    if (!member || !member.id) {
      this.setData({ loginStatus: true})
      return;
    } else this.setData({ advertiseStatus: true, userInfo: member});
    // 加载数据
    this.loadData();
  },
  login: function () {
    let userInfo = this.data.userInfo
    this.loadData();
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.baseUrl+'/mini/login/login.action',
          data: {
            code: res.code,
            'mem.nickname': this.data.userInfo.nickName,
            'mem.sex': this.data.userInfo.gender,
            'mem.headimgurl': this.data.userInfo.avatarUrl,
            'mem.country': this.data.userInfo.country,
            'mem.province': this.data.userInfo.province,
            'mem.city': this.data.userInfo.city
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            // 缓存信息
            if (res && res.data && res.data) {
              if (res.data.member) {
                wx.setStorageSync('member', res.data.member)
                wx.setStorageSync('loginInfo', res.data)
              }
            }
          },
          fail: (res) => {},
          complete: (res) => {
            msgDlg.hideLoading();
          },
        })
      }
    })
  },
  // 加载数据
  loadData: function () {
    msgDlg.showLoading('正在加载中');
    indexService.findList({
      data: {},
      success: (res) => {
        if (res.data && !res.data.message && res.data.msg != 'fail') {
          res.data.filter(item => {
            item.showImages = [];
            item.showImages.push(this.data.urlPrefix+item.livingRoom);
            item.showImages.push(this.data.urlPrefix +item.diningRoom);
            item.showImages.push(this.data.urlPrefix +item.bedroom);
            item.showImages.push(this.data.urlPrefix +item.secondaryRoom);
            item.showImages.push(this.data.urlPrefix +item.functionRoom);
            item.showImages.push(this.data.urlPrefix +item.veranda);
          })
          this.setData({ taocanList: res.data || [] });
        } else msgDlg.showModal('错误提示', res.data.message || res.data.state || '查询出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state  || '查询出错！', false);
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    });
    this.loadHXList();
    this.loadFGList();
  },
  onQuery: function (e) {
    let keywords = e.detail.value;
  },
  onShow: function () {
    if (!this.data.loginStatus) {
      let member = wx.getStorageSync('member');
      if (!member || !member.id) {
        this.setData({ 
          loginStatus: true,
          shareVisible: false,
          postVisible: false,
          advertiseStatus: false
         })
        return;
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    this.setData({ shareVisible: false });
    if (ops.from === 'button') {}
    return {
      title: '分享',
      imageUrl: '../image/post1.jpg',//图片地址
      path: '/pages/index/index',// 用户点击首先进入的当前页面
      success: function (res) {},
      fail: function (res) {}
    }
  },
  onShareVisible: function (e) {
    var shareVisible = this.data.shareVisible;
    this.setData({ shareVisible: !shareVisible});
  },
  buildPosterSaveAlbum: function () {
    this.setData({shareVisible: false})
    wx.showLoading({ title: '生成中...', })
    let that = this;
    const context = wx.createCanvasContext('firstCanvas');
    context.setFillStyle('#fff');
    context.fillRect(0, 0, this.data.winWidth * 0.8, this.data.winHeight * 0.75);
    context.setFontSize(16);
    context.setTextAlign('left')
    context.setStrokeStyle('#DCDFE6');
    context.setFillStyle('#606266');
    context.fillText('喜 家',10,18);
    context.setFontSize(12);
    context.setFillStyle('#606266');
    context.fillText('—— 有品质的社区软装设计拼团系统', 15, 33);
    context.rect(0, 45, this.data.winWidth * 0.8, 0)
    context.setLineWidth(0.2)
    context.drawImage('../image/post1.jpg', 10, 50, this.data.winWidth * 0.8 - 20, (this.data.winHeight * 0.75) - 135)
    context.setStrokeStyle('#DCDFE6');
    context.rect(0, (this.data.winHeight * 0.75) - 80, this.data.winWidth * 0.8, 0);
    context.drawImage('../image/code.jpg', 10, (this.data.winHeight * 0.75) - 75, 75, 75);
    context.setFillStyle('#606266');
    let textWidth = context.measureText('长按识别小程序二维码');
    context.fillText('长按识别小程序二维码', this.data.winWidth - textWidth.width - 75 - 20 , (this.data.winHeight * 0.75) - 50);
    context.setFillStyle('#909399');
    let textWidth1 = context.measureText('进店购买');
    context.fillText('进店购买', this.data.winWidth - textWidth1.width - 75 - (textWidth.width / 2), (this.data.winHeight * 0.75) - 30);
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(() => {
      that.setData({ postVisible: true});
      msgDlg.hideLoading();
    },2000)
  },
  //点击保存到相册
  baocun1: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({ postVisible: false});
            }
          }, fail: (res) => {}
        })
      }
    })
  },
  //保存图片至相册
  baocun: function (e) {
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.data.winWidth * 0.8,
        height: this.data.winHeight * 0.75,
        quality: 1,
        canvasId: 'firstCanvas',
        fileType: 'png',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.hideLoading();
              wx.showToast({ title: '保存成功'});
            },
            fail: (res) => {
              console.log(res)
              wx.hideLoading()
            }
          })
        }
      })
    }, 500);
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      loginStatus: false
    });
    this.login();
  },
  clickDetail: function (e) {
    wx.navigateTo({
      url: '../mobile/index?id=' + e.currentTarget.dataset.taocan.id
    })
  },
  closePost: function (e) {
    this.setData({ postVisible: false})
  },
  clickAdvertise: function () {
    let advertiseStatus = this.data.advertiseStatus;
    this.setData({ advertiseStatus: !advertiseStatus })
  },
  // 加载预约信息
  loadSubscribeList: function () {
    let $this = this
    subscribeService.queryList({
      data: {},
      success: function (res) {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) $this.setData({ orderList: res.data });
        else msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '查询出错！', false);
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    });
  },
  // 查询风格信息
  loadHXList: function () {
    let $this = this
    huxingService.queryList({
      data: {},
      success: (res) => {
        if (res.data && (!res.data.msg || res.data.msg !== 'fail')) $this.setData({ hxList: res.data });
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
    let sub = this.data.subscribe;
    sub.name = e.detail.value;
  },
  phoneInput: function (e) {
    let sub = this.data.subscribe;
    sub.phone = e.detail.value;
  },
  bindHX: function (e) {
    let hx = ''
    if (this.data.hxList && this.data.hxList.length) hx = this.data.hxList[e.detail.value].id
    let subscribe = this.data.subscribe
    subscribe.houseType = hx;
    this.setData({ hxIndex: e.detail.value, subscribe: subscribe })
  },
  bindFG: function (e) {
    let fenggeId = ''
    if (this.data.fgList && this.data.fgList.length) fenggeId = this.data.fgList[e.detail.value].id
    let subscribe = this.data.subscribe
    subscribe.fenggeId = fenggeId;
    this.setData({ fgIndex: e.detail.value, subscribe: subscribe })
  },
  /**
   * 预约
   */
  saveSubscribe: function (e) {
    let $this = this
    let subscribe = this.data.subscribe;
    if (!subscribe || !subscribe.name) {
      wx.showToast({ title: '请填写姓名！', icon: 'none' })
      return
    }
    if (!subscribe || !subscribe.phone) {
      wx.showToast({ title: '请填写电话！', icon: 'none' })
      return
    } else if (subscribe.phone) {
      // 判断手机格式是否正确
    }
    if (!subscribe || !subscribe.houseType || !subscribe.fenggeId) {
      wx.showToast({ title: '请选择户型或选择风格！', icon: 'none' })
      return
    }
    msgDlg.showLoading('正在报名中...');
    subscribeService.saveSubscribe({
      data: { name: subscribe.name, phone: subscribe.phone, huXing: { id: subscribe.houseType }, fengge: {id: subscribe.fenggeId} },
      success: function (res) {
        msgDlg.hideLoading();
        console.log('saveSubscribe:', res)
        if (res.statusCode === 200) {
          if (res.data && (!res.data.msg || res.data.msg !== 'fail')) {
            $this.loadSubscribeList()
            $this.setData({
              advertiseStatus: false,
              subscribe: { name: '', phone: '', houseType: '', fenggeId: '' },
              hxIndex: null,
              fgIndex: null
            })
            wx.showToast({ title: '报名成功！', icon: 'success' })
          } else msgDlg.showModal('错误提示', res.state || res.data.state || '报名出错！', false);
        } else if (res.statusCode === 404) msgDlg.showModal('错误提示', '404!', false);
      },
      fail: (res) => {
        msgDlg.showModal('错误提示', res.state || res.data.state || '报名出错！', false);
      },
      complete: (res) => {
        msgDlg.hideLoading();
      }
    })
  },
  previewImage: function(e) {
    let images = e.currentTarget.dataset.images;
    let index = e.currentTarget.dataset.index || this.data.currentTab;
    wx.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  swichNav: function (e) {
    if (this.data.currentCate === e.currentTarget.dataset.current) return false;
    else this.setData({ currentCate: e.currentTarget.dataset.current });
  },
})
