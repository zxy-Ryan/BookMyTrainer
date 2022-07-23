// pages/trainees/trainees.js
const app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainers: [
      { id:1,name: '李雷' }, 
      { id:2,name: '韩梅梅' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      time: time.substr(0,10)
    });
    this.setData({ openid: app.globalData.openid})
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_list',
        status: 2
      },
      success: res => {
        console.warn('[云函数] [request_list] 调用成功：', res)
        this.setData({namelist: res.result})
      },
      fail: err => {
        console.error('[云函数] [request_list] 调用失败：', err)
      }
    })

    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_res_class',
        openid: app.globalData.openid
      },
      success: res => {
        console.warn('[云函数] [request_res_class] 调用成功：', res)
        this.setData({ res_class: res.result[0].res_class_num })
      },
      fail: err => {
        console.error('[云函数] [request_res_class] 调用失败：', err)
      }
    })

    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_log',
        openid: app.globalData.openid
      },
      success: res => {
        console.warn('[云函数] [request_log] 调用成功：', res.result[0])
        this.setData({ weeknum: res.result[0].weeknum })
        this.setData({ monthnum: res.result[0].monthnum })
        this.setData({ total: res.result[0].total })
        if (res.result[0].total>0){
          this.setData({ still_have_class:1})
        }
      },
      fail: err => {
        console.error('[云函数] [request_log] 调用失败：', err)
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
  // onPulling() {
  //   console.log('onPulling')
  // },
  // onRefresh() {
  //   console.log('onRefresh')

  //   this.setData({ count: 10 })

  //   setTimeout(() => {
  //     this.setData({ items: getList() })
  //     $stopWuxRefresher()
  //   }, 3000)
  // },




  onPullDownRefresh: function () {
    console.log('onRefresh')

    this.setData({ count: 10 })

    setTimeout(() => {
      this.setData({ items: getList() })
    }, 3000)

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
  clickMe: function () {
    // <navigator url="/Reservation/Reservation?id={{item.id}}" open-type="navigate">
    // </navigator>
  }
})





