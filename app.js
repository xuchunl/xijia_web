App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              if (this.userInfoReadyCallback) this.userInfoReadyCallback(res)
            }, fail: function () {}
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: "https://www.onezxkj.com/xijia",
    appId: "wx8a40cf3b220bcdf7"
  }
})