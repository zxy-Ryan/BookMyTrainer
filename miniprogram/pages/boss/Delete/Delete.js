// miniprogram/pages/boss/Delete/Delete.js
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
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_xylist',
        status: 2
      },
      success: res => {
        console.warn('[云函数] [request_xylist] 调用成功：', res)
        this.setData({ xylist: res.result })
      },
      fail: err => {
        console.error('[云函数] [request_xylist] 调用失败：', err)
      }
    })

    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_list',
        status: 2
      },
      success: res => {
        console.warn('[云函数] [request_list] 调用成功：', res)
        this.setData({ jllist: res.result })
      },
      fail: err => {
        console.error('[云函数] [request_list] 调用失败：', err)
      }
    })
  },
  delete:function(e){
    if (e.currentTarget.dataset.status==2){
      var shenfen = "教练"
    }
    else{
      var shenfen="会员"
    }
    console.log(e)
    wx.showModal({
      title: '注意！',
      duration: 2000,//显示时长
      content: "您确定要删除" + shenfen + e.currentTarget.dataset.memo_name + "(昵称" + e.currentTarget.dataset.nick_name+")?",
      success: function (res) {
        if (res.confirm) {
          console.log('删除', shenfen, e.currentTarget.dataset.memo_name)
          var openid = e.currentTarget.dataset.openid
          var status = Number(e.currentTarget.dataset.status)
          wx.cloud.callFunction({
            name: 'cloud_funcs',
            data: {
              action: 'deleteperson',
              openid: openid,
              status: status
            },
            success: res => {
              console.warn('[云函数] [deleteperson] 调用成功：', res)
              wx.navigateBack({})
            },
            fail: err => {
              console.error('[云函数] [deleteperson] 调用失败：', err)
            }
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