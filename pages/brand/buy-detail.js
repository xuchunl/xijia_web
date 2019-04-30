const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userImage: [],
    userInfo: {},
    upStatus: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member = wx.getStorageSync('member') || {};
    this.setData({ userInfo: member });
    let imageList = this.data.userImage;
    if (imageList.length < 7) this.setData({ upStatus: false });
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
    this.setData({ shareVisible: false });
    if (ops.from === 'button') { }
    return {
      title: '分享',
      imageUrl: '../image/post2.jpg',//图片地址
      path: '/pages/index/index',// 用户点击首先进入的当前页面
      success: function (res) { },
      fail: function (res) { }
    }
  },
  onUpDown: function () {
    let upStatus = this.data.upStatus;
    this.setData({ upStatus: !upStatus});
  }
})