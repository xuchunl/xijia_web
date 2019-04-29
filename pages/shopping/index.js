var cartService = require('../../apis/cart/cartService')
var msgDlg = require('../../utils/msgDlg')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    isAllCheck: false,
    urlPrefix: app.globalData.baseUrl,
    shoppingList: [],
    totalMny: 0,
    isEditStatus: false,
    ids: null,
    member: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },
  loadData: function(){
    this.setData({ isAllCheck: false });
    let member = wx.getStorageSync('member');
    this.setData({ member: member });
    if (!member || !member.id) {
      this.setData({ shoppingList: [] });
      msgDlg.showModal('系统提示', '请到首页先登录！', false, (res) => {
        if (res.confirm) wx.switchTab({ url: '../index/index' })
      });
      return;
    }
    msgDlg.showLoading('正在加载中');
    cartService.queryCartlist({
      data: {memId: member.id},
      success: (result) => {
        if (result.data && (!result.data.msg || result.data.msg === 'success')) {
          if (result.data.cartMobileList) {
            let shoppingList = result.data.cartMobileList;
            shoppingList.filter(item => {
              item.num = Number(item.num);
              item.isCheck = false;
            })
            this.setData({ shoppingList: shoppingList })
          }
        } else msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false);
      },
      fail: (result) => {
        msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false);
      },
      complete: (result) => {
        msgDlg.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  clickEdit: function(e) {
    let isEditStatus = this.data.isEditStatus;
    this.setData({ isEditStatus: !isEditStatus });
  },
  deleteCart: function(e) {
    let ids = this.data.ids;
    if (ids) {
      cartService.deleteCart({
        data: { ids: ids },
        success: (result) => {
          if (result.data && (!result.data.msg || result.data.msg === 'success')) {
            this.loadData();
            this.clickAllCheck()
            msgDlg.showToast('删除成功！', 'success');
          }
        },
        fail: (result) => {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
        },
        complete: (result) => {}
      })
    } else msgDlg.showToast('请选择商品！');
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
    this.loadData();
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
  },
  clickCheck(e) {
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    shoppingList = shoppingList.filter(item => {
      if (item.id === shopping.id) item.isCheck = !item.isCheck;
      return true;
    })
    this.setData({
      shoppingList: shoppingList
    });
    this.handelTotalMny();
  },
  clickAllCheck(param) {
    let isAllCheck = !this.data.isAllCheck;
    let shoppingList = this.data.shoppingList || [];
    shoppingList.filter(item => {
      item.isCheck = isAllCheck;
      return true;
    })
    this.setData({
      isAllCheck: isAllCheck,
      shoppingList: shoppingList
    });
    this.handelTotalMny();
  },
  deNum(e) {
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    let totalMny = 0;
    if (shopping.num <= 1) {
      msgDlg.showToast('不能再减少了哟！');
      return;
    }
    shoppingList.forEach(item => {
      if (item.id === shopping.id) {
        item.num = --item.num;
        shopping = item;
        return;
      }
    });
    this.setData({ shoppingList: shoppingList });
    this.changeCartNum(shopping);
  },
  addNum(e) {
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    shoppingList.forEach(item => {
      if (item.id === shopping.id) {
        item.num = ++item.num;
        shopping = item;
        return;
      }
    })
    this.setData({ shoppingList: shoppingList });
    this.changeCartNum(shopping);
  },
  changeNum(e) {
    let num = e.detail.value;
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    if (!Number(num)) {
      msgDlg.showToast('不能再减少了哟！');
    } else {
      shoppingList.forEach(item => {
        if (item.id === shopping.id) {
          item.num = num;
          shopping = item;
          return;
        }
      })
    }
    this.setData({ shoppingList: shoppingList });
    this.changeCartNum(shopping);
  },
  // 付款
  doPay: function(e) {
    var that = this;
    let goodsList = this.data.shoppingList.filter(item => item.isCheck)
    if (goodsList.length) {
      wx.setStorageSync("goodsList", goodsList )
      wx.navigateTo({
        url: '../settle/settle?pageType=goodsList&isNow='+false,
      })
    } else msgDlg.showToast('请选择商品！');
  },
  changeCartNum: function(param) {
    let member = this.data.member;
    cartService.changeCartNum({
      data: { id: param.id, num: param.num, memId: member.id},
      success: (res) => {
        console.log('res:', res);
        if (res.data && res.data.msg && res.data.msg == 'success') {
          this.handelTotalMny();
        }
      },
      fail: (err) => {}
    })
  },
  handelTotalMny: function (){
    let totalMny = 0;
    let isAllCheck = this.data.isAllCheck;
    let shoppingList = this.data.shoppingList || [];
    let count = 0;
    let ids = '';
    shoppingList = shoppingList.filter(item => {
      if (item.isCheck) {
        totalMny = (Number(totalMny) + (Number(item.price || 0)).toFixed(2) * Number(item.num));
        ids += ids ? ',' : '';
        ids += item.id
        count++;
      }
      return true;
    })
    if (count === shoppingList.length) isAllCheck = true;
    else isAllCheck = false;
    this.setData({
      isAllCheck: isAllCheck,
      totalMny: totalMny,
      ids: ids
    })
  }
})