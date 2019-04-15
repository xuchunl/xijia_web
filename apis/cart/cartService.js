import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_CART_LIST_URL: "/hyht/mini/cart/cartList.action",
  SAVE_CART_URL: "/hyht/mini/cart/saveCart.action",
  DELETE_CART_URL: "/hyht/mini/cart/delCartItem.action"
}

module.exports = {
  queryCartlist: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERY_CART_LIST_URL + '?cartBean.memId=' + param.data.memId,
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
  saveCart: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.SAVE_CART_URL + '?cartBean.goodsId=' + param.data.goodsId + '&cartBean.memId=' + param.data.memId + '&cartBean.guigeIds=' + param.data.guigeIds + '&cartBean.num=' + param.data.num,
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
  deleteCart: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.DELETE_CART_URL + '?cartBean.delCartIds=' + param.data.ids,
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