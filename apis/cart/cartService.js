import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  QUERY_CART_LIST_URL: "/mini/cart/cartList.action",
  SAVE_CART_URL: "/mini/cart/saveCart.action",
  DELETE_CART_URL: "//mini/cart/delCartItem.action"
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
    let cartGoodsParam = '';
    if (param.data.cartGoodsList && param.data.cartGoodsList.length && !param.data.id) {
      param.data.cartGoodsList.filter((item, index) => {
        if (item.num) {
          cartGoodsParam += '&cartBean.cartGoodsList[' + index + '].goods.id=' + item.goods.id + 
            '&cartBean.cartGoodsList[' + index + '].fgPosition.id=' + item.fgPosition.id + 
            '&cartBean.cartGoodsList[' + index + '].cate.id=' + item.cate.id +
            '&cartBean.cartGoodsList[' + index + '].num=' + item.num +
            '&cartBean.cartGoodsList[' + index + '].price=' + item.price +
            '&cartBean.cartGoodsList[' + index + '].totalMny=' + item.totalMny
        }
      })
    }
    const $task = $requst.doPost({
      url: serviceURL.SAVE_CART_URL + '?cartBean.goodsId=' + (param.data.goodsId || '') + (param.data.id ? '&cartBean.cartMobileId=' + param.data.id : '') + '&cartBean.memId=' + param.data.memId + '&cartBean.guigeIds=' + (param.data.guigeIds || '') + '&cartBean.num=' + param.data.num + (cartGoodsParam || '') + '&cartBean.fgPositionId=' + (param.data.fgPosition.id || null) + '&cartBean.fgPositionName=' + (param.data.fgPosition.name || null) + '&cartBean.ciimgUrl=' + param.data.ciimgUrl,
      data: param.data,
      method: 'POST',
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