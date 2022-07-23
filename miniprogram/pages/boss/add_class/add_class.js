// miniprogram/pages/boss/add_class/add_class.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setnum:-1,
    addupnum:0,
    currentopenid:'',
    hiddenmodalput: true,  
    listData: [
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "03", "text": "text3", "type": "type3" },
      { "code": "04", "text": "text4", "type": "type4" },
      { "code": "05", "text": "text5", "type": "type5" },
      { "code": "06", "text": "text6", "type": "type6" },
      { "code": "07", "text": "text7", "type": "type7" }
    ]
  },


  addup: function (e) {

    var value = e.detail.value;
    console.log(e);
    this.setData({
      addupnum: Number(value),
      currentopenid:e.currentTarget.dataset.openid
    });
  },

  setup: function (e) {

    var value = e.detail.value;
    console.log(e);
    this.setData({
      setnum: Number(value),
      currentopenid: e.currentTarget.dataset.openid
    });
  },

  Check_confirm:function(e){
    var that=this
    var openid = this.__data__.openid;
    var addupnum = this.__data__.addupnum;
    var setnum = this.__data__.setnum;
    var nickname = e.currentTarget.dataset.nickname;

    if (this.__data__.currentopenid == e.currentTarget.dataset.openid){
      wx.showModal({
        title: '确认课程更改信息',
        duration: 2000,//显示时长
        content: nickname + "的课程设置为增加" + addupnum + "节课或设置为" + setnum,
        success: function (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'cloud_funcs',
              data: {
                action: 'change_class_num',
                openid: openid,
                addupnum: addupnum,
                setnum: setnum,
              },
              success: res => {
                console.warn('[云函数] [change_class_num] 调用成功：', res)
              },
              fail: err => {
                console.error('[云函数] [change_class_num] 调用失败：', err)
              }
            })
            that.setData({
              addupnum: 0,
              setnum: -1
            });

            wx.navigateTo({
              url: '../add_class/add_class',
            })
          }
        }
      })
    }
    else{
      wx.showModal({
        title: '请在对应学员后面点击Check键',
        duration: 1500,//显示时长
      })

    }
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ openid: app.globalData.openid })
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_xylist',
        status: 2
      },
      success: res => {
        console.warn('[云函数] [request_xylist] 调用成功：', res)
        this.setData({ namelist: res.result })
      },
      fail: err => {
        console.error('[云函数] [request_xylist] 调用失败：', err)
      }
    })


  },

  addnum:function(event){
    console.log(event)
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