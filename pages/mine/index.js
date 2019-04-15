Page({
  data: {
    userInfo: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member = wx.getStorageSync('member') || {}
    this.setData({ userInfo: member});
  },
  toOrder: function (e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({ url: '../order/index?type=' + type})
  }
})