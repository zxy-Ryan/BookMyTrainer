// miniprogram/pages/trainers/update/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    max:200,
  

  },
  limit: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);

    if (length > this.data.noteMaxLen) {
      return;
    }

    this.setData({
      current: length,
      content: value,
      
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit(e) {
    if (this.data.current == 0) {
      wx.showModal({
        title: '提示',
        content: '您好像没有写简历哦',
        showCancel: false
      })
    }
    else {
      wx.cloud.callFunction({
        name: 'synchro_funcs',
        data: {
          action: 'update_trainerinfo',
          content: this.data.content,
          openid: getApp().globalData.openid,
        }
      }).then(res => {
        wx.navigateBack();
      }) 
    }
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

  uploadimg: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          source: res.tempFilePaths
        })
      }
    })
  },
  uploadimg1: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          source1: res.tempFilePaths
        })
      }
    })
  },
  uploadimg2: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          source2: res.tempFilePaths
        })
      }
    })
  },
  uploadimg3: function () {
    wx.navigateTo({
      url: './test/test',
    })
    // var that = this;
    // wx.chooseImage({ //从本地相册选择图片或使用相机拍照
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     that.setData({
    //       source3: res.tempFilePaths
    //     })
    //   }
    // })
  },

})