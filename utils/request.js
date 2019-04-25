
const SERVER_BASE_URL = "https://www.onezxkj.com/xijia";
// const SERVER_BASE_URL = "192.168.43.202"; 

/**
 * Get
 */
const doGet = function(params) {
  params = params || {};
  params.method = "GET";
  return $request(params);
} 

/**
 * Post
 */
const doPost = function (params) {
  params = params || {};
  params.method = "POST";
  return $request(params);
} 

/**
 * 原始 request
 */
const $request = function (params) {
  return wx.request({
    /** 开发者服务器接口地址 */
    url: SERVER_BASE_URL + params.url,
    /** 请求的参数 */
    data: params.data,
    /** 设置请求的 header , header 中不能设置 Referer */
    header: params.header,
    /** 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT */
    method: params.method || "GET",
    /** 默认为 json。如果设置了 dataType 为 json，则会尝试对响应的数据做一次 JSON.parse */
    dataType: params.dataType || "json",
    /** 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'} */
    success: function (res) {
      if (params.success) params.success(res);
    },
    /** 接口调用失败的回调函数 */
    fail: function (res) {
      if (params.fail) params.fail(res);
    },
    /** 接口调用结束的回调函数（调用成功、失败都会执行）*/
    complete: function (res) {
      if (params.complete) params.complete(res);
    }
  })
}

module.exports = {
  doGet: doGet,
  doPost: doPost,
  $request: $request,
  SERVER_BASE_URL: SERVER_BASE_URL
}