import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_LIST_URL: "/mini/fengGe/queryList.action",
}

module.exports = {
  queryList: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERY_LIST_URL,
      data: param.data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: param.success,
      fail: param.fail,
      complete: param.complete
    });
    return $task;
  }
}