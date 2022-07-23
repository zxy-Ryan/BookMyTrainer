// miniprogram/pages/boss/xylog/xylog.js
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
    var that=this
    
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_all_log',
      },
      success: res => {
        console.log('[云函数] [request_all_log] 调用成功：', res)
        that.setData({ logall: res.result.data })


        wx.cloud.callFunction({
          name: 'cloud_funcs',
          data: {
            action: 'request_xylist',
            status: 2
          },
          success: res => {
            console.warn('[云函数] [request_xylist] 调用成功：', res)
            var logbefore = that.__data__.logall
            var myMap = new Map();
            
            for(let i=0;i<res.result.length;i++){
              myMap.set(res.result[i].openid, [res.result[i].nick_name, res.result[i].res_class_num])
            }
            console.log(myMap)

            for (let i=0;i<logbefore.length;i++){
              logbefore[i].nick_name = myMap.get(logbefore[i].openid)[0]
              logbefore[i].res_class_num = myMap.get(logbefore[i].openid)[1]
            }
            console.log(logbefore)

            that.setData({ logrecord: logbefore})
          },
          fail: err => {
            console.error('[云函数] [request_xylist] 调用失败：', err)
          }
        })

      },
      fail: err => {
        console.error('[云函数] [request_all_log] 调用失败：', err)
      }
    })
    
    console.log('namellist',this.namelist)

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

var showmelog = function () {
  
  

}
