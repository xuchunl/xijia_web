import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERYLIST_URL: "/mini/subscribe/query.action",
  SAVE_SUBSCRIBE_URL: "/mini/subscribe/save.action",
}

module.exports = {
  queryList: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERYLIST_URL + '?opr=h',
      data: param.data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: param.success,
      fail: param.fail,
      complete: param.complete
    });
    return $task;
  },
  saveSubscribe: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.SAVE_SUBSCRIBE_URL + '?subBean.subscribe.name=' + param.data.name + '&subBean.subscribe.phone=' + param.data.phone + '&subBean.subscribe.huXing.id=' + param.data.huXing.id + '&subBean.subscribe.fengge.id=' + param.data.fengge.id,
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