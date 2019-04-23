import $requst from '../../utils/request.js'

/**
 * 服务URL
 */
const serviceURL = {
  BRAND_URL_LIST: "/mini/mall/brandGoodList.action",
}

module.exports = {
  brandGoodList: function (param) {
    const $task = $requst.doPost({
      // + "?mallBean.searchCondition=" + param.data.searchCondition + "&mallBean.brandId=" + param.data.brandId
      url: serviceURL.BRAND_URL_LIST ,
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
  }
}