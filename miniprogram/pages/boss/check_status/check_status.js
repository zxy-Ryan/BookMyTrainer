// miniprogram/pages/boss/check_status/check_status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status,
      // namelist: namelist
    })

    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_list',
        status: options.status
      },
      success: res => {
        console.warn('[云函数] [request_list] 调用成功：', res)
        this.setData({ namelist: res.result })
      },
      fail: err => {
        console.error('[云函数] [request_list] 调用失败：', err)
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
  },

  clickMe:function(e){
    if (e.currentTarget.dataset.status==1){

    }else{
      wx.navigateTo({ url: "./Person/Person?status=" + e.currentTarget.dataset.status + "&openid=" + e.currentTarget.dataset.openid, })
    }
    
  }
})