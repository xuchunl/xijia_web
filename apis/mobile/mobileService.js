import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  DETAIL_URL: "/mini/wz/details.action",
  QUERY_HX_URL: '/mini/wz/huxing/details.action',
  DETAIL_OF_GOODS_URL: '/mini/mall/detailOfGoods.action',
  FIND_BY_ID_URL: '/mini/mall/findByIds.action',
  CATE_LIST_URL: '/mini/mall/cate/query4Pagin.action'
}

module.exports = {
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
  // 获取户型信息
  queryHx: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.QUERY_HX_URL + "?huxingBean.huxing.id=" + param.data.id,
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
  // 查询商品规格所有信息
  detailOfGoods: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.DETAIL_OF_GOODS_URL + "?mallBean.goodsId=" + param.data.id,
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
  // 根据选择商品规格后， 查询出商品相应规格的相关信息
  findByIds: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.FIND_BY_ID_URL + "?mallBean.goodsGuige.goodsId=" + param.data.goodsId + '&mallBean.goodsGuige.ids=' + param.data.guigeId,
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
  // 查询类别列表
  findCatelist: function (param) {
    const $task = $requst.doPost({
      url: serviceURL.CATE_LIST_URL,
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