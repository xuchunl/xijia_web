import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_LIST_URL: "/hyht/mini/receiver/queryList.action",
  SAVE_RECEIVER_URL: '/hyht/mini/receiver/save.action',
}

module.exports = {
  // 查询会员地址列表
  queryList: function (param) {
    console.log(param)
    const $task = $requst.doPost({
      url: serviceURL.QUERY_LIST_URL + '?receiverBean.receiver.memId=' + param.data.memId,
      data: param.data,
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
  // 保存地址
  saveReceiver: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.SAVE_RECEIVER_URL + '?receiverBean.receiver.memId=' + param.data.memId + '&receiverBean.receiver.name=' + param.data.name + '&receiverBean.receiver.mobile=' + param.data.mobile + '&receiverBean.receiver.isDel=' + param.data.isDel + '&receiverBean.receiver.address=' + param.data.address + '&receiverBean.receiver. isDefault=' + param.data.isDefault,
      data: JSON.stringify(param.data),
      header: {
        "Content-Type": "application/json;charset=utf-8"
      },
      success: param.success,
      fail: param.fail,
      complete: param.complete
    });
    return $task;
  },
}