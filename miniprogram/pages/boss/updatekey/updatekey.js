// miniprogram/pages/boss/updatekey/updatekey.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var _this=this
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_gym_intro',
      },
      success: function (res) {
        console.log('[云函数] [request_gym_intro] 调用成功：', res)
        var Keys = res.result.data[0].Key;
        _this.setData({ jlkey: Keys.jl });
        _this.setData({ xykey: Keys.xy });
      },
      fail: function (res) {
      }
    })
  },

  xyinput: function (e) {
    var value = e.detail.value;
    this.setData({
      xykey: value
    });
  },

  jlinput: function (e) {
    var value = e.detail.value;
    this.setData({
      jlkey: value
    });
  },
  formSubmit(e) {
    console.log(this)
    // var keycode = this.__data__.xykey;
    var Key={
      xy: this.__data__.xykey,
      jl: this.__data__.jlkey
    }
    wx.showModal({
      title: '确认秘钥修改信息',
      duration: 2000,//显示时长
      content: "您希望把会员秘钥修改为" + this.__data__.xykey + "把教练秘钥修改为" + this.__data__.jlkey + "?",
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'cloud_funcs',
            data: {
              action: 'update_key',
              key: Key
            },
            success: function (res) {
              console.log('[云函数] [update_key] 调用成功：update完成')
            },
            fail: function (res) {
            }
          })
          wx.navigateBack({
          })

          }
        }
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})