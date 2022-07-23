//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '健身预约',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.onGetOpenid()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        // accountnum:getApp().globalData.openid,

        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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

  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }

  },



  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  clickMe: function(event) {
    
    // console.log(event); 
    var openid=event.currentTarget.dataset.openid;
    var nickname = event.currentTarget.dataset.nickname;
    if (openid != "oo6Ov4kv4SLvgRen7KjZwX40dGFo" && openid != "oo6Ov4jkpkYH28VAjZmZWPuROZWs" && openid !="oo6Ov4maPo4IcxVte3gx06n8C2X4"){
    // if (nickname != "唐巍" && nickname != "Ryan" && nickname!="Ravol.T") {
      wx.showModal({
        title: 'ooPs',
        content: "您好像不是Boss呀，请联系管理员开通权限"
      })
    }
    else{
      wx.navigateTo({ url: "../boss/boss", })
    }
  },
  clicktrainees:function(e){
    // 1是学员，2是教练，3是店长
    this.setData({ ggg: e })
    // ((query_status.data[0].trainee).indexOf(wxContext.OPENID) != -1)
    //console.log(status)
    if((e.currentTarget.dataset.status).indexOf(1)!=-1){
      wx.navigateTo({ url: "../trainees/trainees",})
    }
    else{
      wx.showModal({
        title: '提示',
        content: "你好像不是学员啊，注册一个吧？",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定注册会员')
            wx.navigateTo({ url: "./register/register", })
          }
        }
      })
    }
  },
  clicktrainers: function (e) {
    
    // 1是学员，2是教练，3是店长
    if ((e.currentTarget.dataset.status).indexOf(2) != -1) {
      wx.navigateTo({ url: "../../package-trainers/pages/trainers/trainers?nick_name=" + e.currentTarget.dataset.nickname + "&openid=" + e.currentTarget.dataset.openid, })
    }
    else {
      wx.showModal({
        title: '提示',
        content: "你好像不是教练啊，注册一个吧？",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({ url: "./register/register", })
          }
        }
      })
    }
  },
  clickboss: function (e) {
    // 1是学员，2是教练，3是店长
    if ((e.currentTarget.dataset.status).indexOf(3) != -1) {
      wx.navigateTo({ url: "../boss/boss", })
    }
    else {
      wx.showModal({
        title: '提示',
        content: "你好像不是Boss啊，注册一个吧？",
        success: function (res) {
          if (res.confirm) {
            console.log('用户试图登陆boss')
            wx.navigateTo({ url: "./register", })
          }
        }
      })
    }
  },

  onGetOpenid:function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        //return res.result.openid
        console.log('[云函数] [login] user openid: 获得打开者的openid', res.result.openid)
        this.setData({status: res.result.status })
        this.setData({openid:res.result.openid})
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }

    })

  }



})

var fonGetOpenid=function() {
  // 调用云函数
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      
      //this.setData({openid:res.result.openid})
      app.globalData.openid = res.result.openid
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      // wx.navigateTo({
      //   url: '../deployFunctions/deployFunctions',
      // })
    }
    
  })
  
}
