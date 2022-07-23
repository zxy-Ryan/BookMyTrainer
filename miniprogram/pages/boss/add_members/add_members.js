// miniprogram/pages/boss/add_members/add_members.js
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
    })
    const db = wx.cloud.database()
    db.collection('Request_check_test').where({ status: Number(options.status) }).get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条  
      this.setData({ namelist: res.data })
      console.log(res.data)
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

  /**
   * 点击昵称数据库转换
   */
  clickName:function(e){
    var that=this
    var openid = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: "你要把 " + e.currentTarget.dataset.nn +" 设成自己的人吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //that.setData({ openid_change: e.currentTarget.dataset.openid })
          databaseupdate(e.currentTarget.dataset.openid, e.currentTarget.dataset.status)

          wx.navigateBack({
          })
        }
      }
    })
    

  }
  
})

var databaseupdate=function(openid,status){
  var that=this
  wx.cloud.callFunction({
    name: 'cloud_funcs',
    data: {
      action: 'transfer_from_request',
      open_id: openid,
      status: status
    },
    success: res => {
      console.warn('[云函数] [cloud_funcs] transfer_from_request 调用成功：', res)
      //that.setData({res:res})
      wx.showToast({
        title: '成功转移',
      })
      // wx.setStorageSync('wxacodeCloudID', res.result)可能有用啊
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '调用失败',
      })
      console.error('[云函数] [cloud_funcs] transfer_from_request：', err)
    }
  })
  
}

var request= async function (status) {
  //在Status_check里添加身份
  var that = this
  wx.cloud.callFunction({
    name: 'cloud_funcs',
    data: {
      action: 'request_list',
      status: status
    },
    success: res => {
      console.warn('[云函数] [request_list] 调用成功：', res)
      //that.setData{namelist: res.result}
    },
    fail: err => {
      console.error('[云函数] [request_list] 调用失败：', err)
    }
  })
  return res.result
}
