import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  PAY_CONFIRM_URL: "/mini/order/toPayConfirm.action",
  NO_PAY_CONFIRM_URL: '/mini/order/payConfirmWfkSave.action',
}

module.exports = {
  // 支付待确认页面
  toPayConfirm: function (param) {
    console.log(param)
    const $task = $requst.doPost({
      url: serviceURL.PAY_CONFIRM_URL + '?orderBean.sumPayPrice=' + param.data.sumPayPrice + '&orderBean.memId=' + param.data.memId,
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
  // 保存未付款的订单
  payConfirmWfkSave: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.NO_PAY_CONFIRM_URL + '?orderBean.out_trade_no=' + param.data.out_trade_no + '&orderBean.memId=' + param.data.memId + '&orderBean.rece.id=' + param.datarece.id.rece.id + '&orderBean.isTuan=' + param.data.isTuan,
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