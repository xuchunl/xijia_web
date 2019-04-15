import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_URL: "/hyht/mini/wz/query.action",
  DETAIL_URL: "/hyht/mini/wz/details.action",
}

module.exports = {
  findList: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERY_URL,
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
  // 查询商品详情
  details: function (param) {
    console.log(param)
    const $task = $requst.doPost({
      url: serviceURL.DETAIL_URL + '?fgPositionBean.fgPosition.id=' + param.data.id,
      data: JSON.stringify(param.data),
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'POST',
      success: param.success,
      fail: param.fail,
      complete: param.complete
    });
    return $task;
  },
}