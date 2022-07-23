// miniprogram/pages/index/firstpage/firstpage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenName:true,

    latitude: 40.040596,
    longitude: 116.548116,
    markers: [{
      id: 1,
      latitude: 40.035011,
      longitude: 116.543587,
      name: 'T.I.T 创意园'
    }],

  },
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../index'
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;


    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_gym_intro',
      },
      success: function (res) {
        console.log('[云函数] [request_gym_intro] 调用成功：', res)
        var Intro_pic = res.result.data[0].Intro;
        var Advertise = res.result.data[0].advertise;
        _this.setData({ gym_intro: Intro_pic  });
        _this.setData({ Advertise: Advertise });
      },
      fail: function (res) {
      }
    })

    // wx.cloud.callFunction({
    //   name: 'cloud_funcs',
    //   data: {
    //     action: 'request_gym_advertise',
    //   },
    //   success: function (res) {
    //     console.log('[云函数] [request_gym_advertise] 调用成功：', res)
    //     var givenback = res.result.data;
    //     let setn = new Set();
    //     _this.setData({ trainers_intro: givenback });
    //   },
    //   fail: function (res) {
    //   }
    // })

    
















    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  clickme:function(e){
    this.setData({
      hiddenName: !this.__data__.hiddenName
          })
    console.log("打开查看风采展示及活动页面")
    // wx.navigateTo({
    //   url: './Intro_main/Intro_main',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })


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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
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