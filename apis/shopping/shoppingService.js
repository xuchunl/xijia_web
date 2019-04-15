import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_LIST_URL: "",
}

module.exports = {
  findList: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.GET_URL,
      data: param.data,
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      success: param.success,
      fail: param.fail,
      complete: param.complete
    });
    return $task;
  }
}