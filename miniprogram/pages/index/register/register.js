// miniprogram/pages/index/register.js
const app = getApp()
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
    var _this = this
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
  keyinput: function (e) {
    var value = e.detail.value;
    this.setData({
      key: value
    });
  },
  memonameinput: function (e) {
    var value = e.detail.value;
    this.setData({
      memo_name: value
    });
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

  limit: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);

    if (length > this.data.noteMaxLen) {
      return;
    }

    this.setData({
      current: length,
      content: value
    });
  },


  formSubmit(e) {
    var jlkey = this.__data__.jlkey
    var xykey = this.__data__.xykey
    var memo_name = this.__data__.memo_name
    var key = this.__data__.key
    console.log(this)
    if(key==xykey){
      var input={
        status:1,
        memo_name: memo_name
      }
      this.addup_database(input)
      wx.showModal({
        title: '恭喜',
        duration: 3000,//显示时长
        content: "您是自己人，稍等店长确认哈",
      })
      setTimeout(function () {wx.navigateBack()}, 2000)
    }
    else if(key==jlkey){
      var input={
        status:2,
        memo_name:memo_name
      }
      this.addup_database(input)
      wx.showModal({
        title: '恭喜',
        duration: 2000,//显示时长
        content: "您就是自家教练，稍等店长确认哈",
      })
      setTimeout(function () {wx.navigateBack()}, 2000)
    }
    else{
      wx.showModal({
        title: 'ooPs',
        duration: 3000,//显示时长
        content: "暗号不太对呀，再和店长check一下",
      })
      setTimeout(function () {wx.navigateBack()}, 2000)
    }


    // if (keycode== "xy") {
    //   this.addup_database(1)
    //   wx.showModal({
    //     title: '恭喜',
    //     duration: 3000,//显示时长
    //     content: "您是自己人，稍等店长确认哈",
    //   })
      
    //   setTimeout(function () {
    //     wx.navigateBack()
    //   }, 2000)
    // }
    // else if (keycode == "jl") {
    //   this.addup_database(2)
    //   wx.showModal({
    //     title: '恭喜',
    //     duration: 2000,//显示时长
    //     content: "您就是自家教练，稍等店长确认哈",
    //   })
    //   setTimeout(function () {
    //     wx.navigateBack()
    //   }, 2000)
    // }
    // else if (keycode == "dz") {
    //   wx.showModal({
    //     title: '啥？',
    //     duration: 3000,//显示时长
    //     content: "您想当店长，稍等我们确认一下哈",
    //   })
    //   setTimeout(function () {
    //     wx.navigateBack()
    //   }, 2000)
    // }
    // else{
    //   wx.showModal({
    //     title: 'ooPs',
    //     duration: 3000,//显示时长
    //     content: "暗号不太对呀，再和店长check一下",
    //   })
    //   setTimeout(function () {
    //     wx.navigateBack()
    //   }, 2000)
    // }
  },
  
  // 1是学员，2是教练，3是店长，
  addup_database:function(inp){
    var status=inp.status
    var memo_name=inp.memo_name
    const db = wx.cloud.database()
    db.collection('Request_check_test').where({ status: status }, { _openid: app.globalData.openid}).get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      //this.setData({ res: res.data })
      console.log(res)
      if (res.data.length!=0){
        console.log('已经申请过，数据位于列表中')
      }
      else{
        console.log('从未申请过，数据添加中')
        db.collection('Request_check_test').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            status: status,
            nick_name: app.globalData.userInfo.nickName,
            memo_name:memo_name,
            avatarUrl: app.globalData.userInfo.avatarUrl
          }
        }).then(res => {
          console.log(res)
        })
      }
    })


    

  }
  
})
// var addup_database=function (status) {
//   const db = wx.cloud.database()
//     db.collection('Check').add({
//   // data 字段表示需新增的 JSON 数据
//   data: {
//     status: status,
//     nick_name: getApp().globalData.userInfo,
//   }
// }).then(res => {
//   console.log(res)
// })
// }
