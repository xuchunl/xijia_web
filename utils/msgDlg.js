//系统一些提示信息
module.exports = {
  showModal: function (title, msg, showCancel, successCallback, failCallback) {
    wx.showModal({
      title: title || '消息',
      content: msg,
      showCancel: showCancel || false,
      cancelText: '取消',
      success: function (res) {
        if (successCallback) {
          successCallback(res);
        }
        if (failCallback) {
          failCallback(res);
        }
      }
    })
	},
	showLebalError : function(flag) {
		return "加载" + flag + "时出现错误，请联系开发人员。错误信息：\n";
	},
  showToast: function (msg, icon, mask, duration, success, fail, complete) {
    wx.showToast({
      title: msg || '成功',
      mask: mask || true,
      icon: icon || 'none',
      duration: duration || 2000,
      success: success,
      fail: fail,
      complete: complete
    })
	},
  showLoading: function(title, mask, success, fail, complete){
    wx.showLoading({
      title: title || '正在加载中',
      mask: mask || true,
      success: success,
      fail: fail,
      complete: complete
    })
  },
  hideLoading: function (success, fail, complete) {
    wx.hideLoading({
      success: success,
      fail: fail,
      complete: complete
    })
  }
};