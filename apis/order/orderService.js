import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  PAY_CONFIRM_URL: "/mini/order/toPayConfirm.action",
  NO_PAY_CONFIRM_URL: '/mini/order/payConfirmWfkSave.action',
  PAY_SUCCESS_URL: '/mini/order/paySuccess.action',
  QUERY_ORDER_URL: '/mini/order/findOrderList.action'
}

module.exports = {
  // 支付待确认页面
  toPayConfirm: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.PAY_CONFIRM_URL + '?orderBean.memId=' + param.data.memId + "&orderBean.isNow=" + (param.data.isNow || false) + "&orderBean.fgPositionId=" + (param.data.fgPositionId || '') + "&weixinBean.mini_appid=" + param.data.mini_appid + "&weixinBean.mini_openid=" + param.data.mini_openid + "&weixinBean.mini_access_token=" + param.data.mini_access_token + "&weixinBean.wpBean.appId=" + param.data.wpBean.appId + "&weixinBean.wpBean.nonceStr=" + param.data.wpBean.nonceStr + "&weixinBean.wpBean.timeStamp=" + param.data.wpBean.timeStamp + "&orderBean.receName=" + param.data.receName + "&orderBean.receAddr=" + param.data.receAddr + "&orderBean.receMobile=" + param.data.receMobile,
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
    let listParam = '';
    if (param.data.orderitemList && param.data.orderitemList.length && !param.data.id) {
      param.data.orderitemList.filter((item, index) => {
        if (item.num) {
          listParam += '&orderBean.orderitemList[' + index + '].goods.id=' + item.goods.id +
            '&orderBean.orderitemList[' + index + '].fgPositionId=' + item.fgPositionId +
            '&orderBean.orderitemList[' + index + '].num=' + item.num +
            '&orderBean.orderitemList[' + index + '].price=' + item.price +
            '&orderBean.orderitemList[' + index + '].xiaoji=' + item.xiaoji +
            '&orderBean.orderitemList[' + index + '].name=' + item.name
        }
      })
    }
    const $task = $requst.doPost({
      url: serviceURL.NO_PAY_CONFIRM_URL + '?orderBean.out_trade_no=' + param.data.out_trade_no + '&orderBean.memId=' + param.data.memId + (param.data.rece ? '&orderBean.rece.id=' + param.data.rece.id : '') + '&orderBean.isTuan=' + param.data.isTuan + (listParam || '') + '&orderBean.sumPayPrice=' + param.data.sumPayPrice + "&orderBean.receName=" + param.data.receName + "&orderBean.receMobile=" + param.data.receMobile + "&orderBean.receAddr=" + param.data.receAddr + "&orderBean.cartIds=" + param.data.ids,
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
  // 支付成功
  paySuccess: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.PAY_SUCCESS_URL + '?orderBean.sumPayPrice=' + param.data.sumPayPrice + '&orderBean.memId=' + param.data.memId + "&orderBean.isNow=" + (param.data.isNow || false) + "&orderBean.fgPositionId=" + (param.data.fgPositionId || '') +  "&weixinBean.mini_appid=" + param.data.mini_appid + "&weixinBean.mini_openid=" + param.data.mini_openid + "&weixinBean.mini_access_token=" + param.data.mini_access_token + "&weixinBean.wpBean.appId=" + param.data.wpBean.appId + "&weixinBean.wpBean.nonceStr=" + param.data.wpBean.nonceStr + "&weixinBean.wpBean.timeStamp=" + param.data.wpBean.timeStamp,
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
  queryOrderList: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERY_ORDER_URL + '?orderBean.memId=' + param.data.memId + "&orderBean.status=" + param.data.status,
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
  }
}