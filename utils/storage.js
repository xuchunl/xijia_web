/**
 * 本地缓存 Storage 
 */
module.exports = {
  /**
   * 将数据存储在本地缓存中指定的key中，会覆盖掉原来该key对应的内容，这是一个异步接口。
   * param : {
   *   key: 本地缓存中的指定的 key
   *   data: 需要存储的内容
   *   success: 接口调用成功的回调函数
   *   fail: 接口调用失败的回调函数
   *   complete: 接口调用结束的回调函数（调用成功、失败都会执行）
   * }
   */
  set: function (param) {
    wx.setStorage({
      key: param.key,
      data: param.data,
      success: param.success,
      fail: param.fail,
      complete: param.complete
    })
  },

  /**
   * ​将data存储在本地缓存中指定的key中，会覆盖掉原来该key对应的内容，这是一个同步接口。
   * key: 本地缓存中的指定的key
   * data: 需要存储的内容
   * time: 可以定期清理缓存数据
   */
  setSync: function(key, data, time) {
    wx.setStorageSync(key, data)
    let seconds = parseInt(time);
    if (seconds > 0) {
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(key + 'dtime', timestamp + "")
    } else {
      wx.removeStorageSync(key + 'dtime')
    }
  },

  /**
   * 从本地缓存中异步获取指定key对应的内容。
   * param : {
   *  key: 本地缓存中的指定的 key
   *  success: 接口调用的回调函数,res = {data: key对应的内容}
   *  fail: 接口调用失败的回调函数
   *  complete: 	接口调用结束的回调函数（调用成功、失败都会执行）
   * }
   */
  get: function (param) {
    wx.getStorage({
      key: param.key,
      success: param.success,
      fail: param.fail,
      complete: param.complete
    })
  },
  /**
   * ​从本地缓存中同步获取指定key对应的内容。
   * key: 本地缓存中的指定的key
   */
  getSync: function (key) {
    let deadtime = parseInt(wx.getStorageSync(key + 'dtime'))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        return false
      }
    }
    let res = wx.getStorageSync(key);
    if (res) return res
    else return false
  },
  /**
   * 异步获取当前storage的相关信息
   * param : {
   *  success: 接口调用的回调函数，返回参数说明: 
   *  {
   *    keys:	当前storage中所有的key
   *    currentSize: 当前占用的空间大小, 单位kb
   *    limitSize: 限制的空间大小，单位kb
   *  }
   *  fail: 接口调用失败的回调函数
   *  complete: 接口调用结束的回调函数（调用成功、失败都会执行）
   * }
   */
  getInfo: function (param) {
    wx.getStorageInfo({
      success: param.success,
      fail: param.fail,
      complete: param.complete
    })
  },
  /**
   * ​同步获取当前storage的相关信息
   */
  getInfoSync: function () {
    return wx.getStorageInfoSync();
  },
  /**
   * 从本地缓存中异步移除指定 key 。
   * param : {
   *  key: 本地缓存中的指定的 key
   *  success: 接口调用的回调函数
   *  fail: 接口调用失败的回调函数
   *  complete: 接口调用结束的回调函数（调用成功、失败都会执行）
   * }
   */
  remove: function (param) {
    wx.removeStorage({
      key: param.key,
      success: param.success,
      fail: param.fail,
      complete: param.complete
    })
  },
  /**
   * ​从本地缓存中同步移除指定 key 。
   * key: 本地缓存中的指定的 key
   */
  removeSync: function (key) {
    return wx.removeStorageSync(key);
  },
  /**
   * 清理本地数据缓存。
   */
  clear: function (param) {
    wx.Storage()
  },
  /**
   * ​同步清理本地数据缓存
   */
  clearSync: function () {
    return wx.clearStorageSync();
  }
}