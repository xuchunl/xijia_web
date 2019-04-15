var cartService = require('../../apis/cart/cartService')
var msgDlg = require('../../utils/msgDlg')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    isAllCheck: false,
    urlPrefix: 'https://www.onezxkj.com/hyht',
    shoppingList: [],
    totalMny: 0,
    isEditStatus: false,
    ids: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
    let totalMny = 0;
    this.data.shoppingList.map(item => {
      totalMny = totalMny + item.price
    })
    this.setData({
      totalMny: totalMny
    })
  },
  loadData: function(){
    let $this = this
    let member = wx.getStorageSync('member') 
    if (!member || !member.id) {
      msgDlg.showModal('系统提示', '请先登录！', false)
      return;
    }
    msgDlg.showLoading('正在加载中');
    cartService.queryCartlist({
      data: {memId: member.id},
      success: function (result) {
        // 返回数据，
        console.log('queryCartlist', result)
        if (result.data && (!result.data.msg || result.data.msg === 'success')) {
          if (result.data.cartMobileList) {
            let shoppingList = result.data.cartMobileList;
            shoppingList.filter(item => {
              item.num = Number(item.num)
              item.isCheck = false;
            })
            $this.setData({
              shoppingList: shoppingList,
            })
          }
        } else {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
        }
      },
      fail: function (result) {
        msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
      },
      complete: function (result) {
        msgDlg.hideLoading();
      }
    })
  },
  clickEdit: function(e) {
    let isEditStatus = this.data.isEditStatus;
    this.setData({
      isEditStatus: !isEditStatus
    })
  },
  deleteCart: function(e) {
    let $this = this
    let ids = this.data.ids;
    if (ids) {
      cartService.deleteCart({
        data: { ids: ids },
        success: function (result) {
          // 返回数据，
          console.log('deleteCart', result)
          if (result.data && (!result.data.msg || result.data.msg === 'success')) {
            $this.loadData()
            // msg, icon, mask, success, fail, complete
            msgDlg.showToast('删除成功！', 'success');
          }
        },
        fail: function (result) {
          msgDlg.showModal('错误提示', result.state || result.data.state || '查询出错！', false)
        },
        complete: function (result) {
          // msgDlg.hideLoading();
        }
      })
    }else {
      // msg, icon, mask, success, fail, complete
      msgDlg.showToast('请选择商品！');
    }
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
  onShareAppMessage: function () {

  },
  clickCheck(e) {
    let isAllCheck = this.data.isAllCheck;
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    let totalMny = this.data.totalMny;
    let count = 0;
    let ids = '';
    shoppingList = shoppingList.filter(item => {
      if (item.id === shopping.id) {
        item.isCheck = !item.isCheck;
        if (!item.isCheck) {
          isAllCheck = false
          totalMny = (Number(totalMny) - (Number(item.price || 0)).toFixed(2) * Number(item.num))
        } else {
          totalMny = (Number(totalMny) + (Number(item.price || 0)).toFixed(2) * Number(item.num))
        }
      }
      if (item.isCheck) {
        ids += ids ? ',' : '';
        ids += item.id
        count++;
      }
      return true;
    })
    if (count === shoppingList.length) {
      isAllCheck = true
    } else {
      isAllCheck = false;
    }
    
    this.setData({
      shoppingList: shoppingList,
      isAllCheck: isAllCheck,
      totalMny: totalMny,
      ids: ids
    })
  },
  clickAllCheck() {
    let isAllCheck = !this.data.isAllCheck;
    let shoppingList = this.data.shoppingList || [];
    let totalMny = 0;
    let ids = '';
    shoppingList.filter(item => {
      item.isCheck = isAllCheck;
      if (isAllCheck) {
        ids += ids ? ',' : '' ;
        ids += item.id
        totalMny = (Number(totalMny) + (Number(item.price || 0)).toFixed(2) * Number(item.num))
      }
      return true;
    })
    this.setData({
      isAllCheck: isAllCheck,
      shoppingList: shoppingList,
      totalMny: totalMny,
      ids: ids
    })
  },
  deNum(e) {
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    let totalMny = 0;
    shoppingList.forEach(item => {
      if (item.id === shopping.id) {
        if (item.num > 1) {
          item.num = --item.num;
        } else {
          msgDlg.showToast('不能再减少了哟！')
        }
        return;
      }
    })
    this.setData({
      shoppingList: shoppingList
    })
  },
  addNum(e) {
    let shopping = e.currentTarget.dataset.shopping;
    let shoppingList = this.data.shoppingList || [];
    shoppingList.forEach(item => {
      if (item.id === shopping.id) {
        item.num = ++item.num;
        return;
      }
    })
    this.setData({
      shoppingList: shoppingList
    })
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
          return;
        }
      })
    }
    this.setData({
      shoppingList: shoppingList
    })
  },
  // 付款
  doPay: function(e) {
    var that = this;
    let goodsList = this.data.shoppingList.filter(item => item.isCheck)
    if (goodsList.length) {
      wx.setStorageSync("goodsList", goodsList )
      wx.navigateTo({
        url: '../settle/settle?pageType=goodsList',
      })
    } else {
      msgDlg.showToast('请选择商品！');
    }
  },
})