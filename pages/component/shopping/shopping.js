// pages/component/shopping.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isCheck: false,
    num: 1,
    isAllCheck: false,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickCheck() {
      let isCheck = !this.data.isCheck;
      this.setData({
        isCheck: isCheck
      })
    },
    clickAllCheck() {
      let isAllCheck = !this.data.isAllCheck;
      this.setData({
        isAllCheck: isAllCheck
      })
    },
    deNum(e) {
      let $this = this;
      var num = $this.data.num;
      $this.setData({
        num: --num
      })

    },
    addNum(e) {
      let $this = this;
      var num = $this.data.num;
      $this.setData({
        num: ++num
      })

    },
    changeNum(e) {
      let num = e.detail.value || 1;
      this.setData({
        num: num
      })
    },

  }
})
