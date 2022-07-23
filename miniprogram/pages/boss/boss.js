// miniprogram/pages/boss/boss.js
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

  addgympic:function(){
    wx.navigateTo({
      url: './add_gym_pic/add_gym_pic',
    })
  },

  updatekey:function(){
    wx.navigateTo({
      url: './updatekey/updatekey',
    })
  },

  confirmjl:function(){
    wx.navigateTo({
      url:"./add_members/add_members?status=2",
    })
  },

  confirmxy: function () {
    wx.navigateTo({
      url: "./add_members/add_members?status=1",
    })
  },

  addxyclass: function () {
    wx.navigateTo({
      url: "./add_class/add_class",
    })
  },

  deletexyjl: function () {
    wx.navigateTo({
      url: "./Delete/Delete",
    })
  },

  checkjllog: function () {
    wx.navigateTo({
      url: "./check_status/check_status?status=2",
    })
  },

  checkxylog: function () {
    wx.navigateTo({
      url: "./xylog/xylog",
    })
  },

  checkgymlog: function () {
    wx.navigateTo({
      url: "./Occupany/Occupany",
    })
  },



})