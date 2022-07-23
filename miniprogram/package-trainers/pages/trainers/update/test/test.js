// miniprogram/pages/trainers/update/test/test.js
const app = getApp()
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值

    txbox: [],//选择图片
    txfileIDs: [],//上传云存储后的返回值

  },
  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  
  // 选择图片 &&&
  addPic1: function (e) {
    
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 5;
    if (5 > imgbox.length > 0) {
      n = 5 - imgbox.length;
    } else if (imgbox.length == 5) {
      n = 1;
    }

    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('这里的res', res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var sizethis = res.tempFiles[0].size;
        var qua = 100;
        if (sizethis > 10000) {
          qua = 20;
        } else {
          if (sizethis > 1000) {
            qua = 50;
          } else {
            if (sizethis > 300) {
              qua = 80;
            }
          }
        }
        console.log('qua', qua)
        wx.compressImage({
          src: tempFilePaths[0], // 图片路径
          quality: qua, // 压缩质量
          success: res => {
            console.log('compressed以后res啥样', res)
            console.log('compressed以后res啥样', imgbox)
            if (imgbox.length == 0) {
              imgbox = [res.tempFilePath]
            } else if (5 > imgbox.length) {
              imgbox = imgbox.concat(res.tempFilePath);
            }
            that.setData({
              imgbox: imgbox
            });
          }
        })
      }
    })
    // wx.chooseImage({
    //   count: n, // 默认9，设置图片张数
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     var tempFilePaths = res.tempFilePaths

    //     if (imgbox.length == 0) {
    //       imgbox = tempFilePaths
    //     } else if (5 > imgbox.length) {
    //       imgbox = imgbox.concat(tempFilePaths);
    //     }
    //     that.setData({
    //       imgbox: imgbox
    //     });
    //   }
    // })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },


  //发布按钮
  fb: function (e) {
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      wx.cloud.callFunction({
        name: 'synchro_funcs',
        data: {
          action: 'delete_lifepic',
          openid: getApp().globalData.openid,
        }
      })





      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          let suffix = getApp().globalData.openid+'/jl_'+getApp().globalData.openid+'_LifePic_'+String(i+1);//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID)//输出上传后图片的返回地址
              wx.cloud.callFunction({
                name: 'synchro_funcs',
                data: {
                  action: 'add_lifepic',
                  openid: getApp().globalData.openid,
                  life_pic: res.fileID
                }
              })
              reslove();
              wx.hideLoading();
              wx.showToast({
                title: "上传成功",
              })
            },
            fail: res => {
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox: []
        })
      })

    }
  },



  // 删除头像照片 &&
  txDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let txbox = this.data.txbox;
    txbox.splice(index, 1)
    that.setData({
      txbox: txbox
    });
  },

  // 选择头像图片 &&&
  txPic1: function (e) {

    var txbox = this.data.txbox;
    console.log(txbox)
    var that = this;
    var n = 1;
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        txbox = tempFilePaths
        that.setData({
          txbox: txbox
        });
      }
    })
  },

  //头像图片
  txbox: function (e) {
    this.setData({
      txbox: e.detail.value
    })
  },


  //发布头像按钮
  txfb: function (e) {
    if (!this.data.txbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      for (let i = 0; i < this.data.txbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.txbox[i];
          let suffix = getApp().globalData.openid + '/jl_' + getApp().globalData.openid + '_TouXiang_' + String(i + 1);
          wx.cloud.uploadFile({
            cloudPath: suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID)//输出上传后图片的返回地址










              wx.cloud.callFunction({
                name: 'synchro_funcs',
                data: {
                  action: 'update_memo_avatarUrl',
                  memo_avatarUrl: res.fileID,
                  openid: getApp().globalData.openid,
                }
              })
              reslove();
              wx.hideLoading();
              wx.showToast({
                title: "上传成功",
              })
            },
            fail: res => {
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));

        // promiseArr.push(new Promise((reslove, reject) => {
        //   wx.cloud.callFunction({
        //     name: 'synchro_funcs',
        //     data: {
        //       action: 'update_trainerinfo',
        //       memo_avatarUrl: this.data.source[0],
        //       openid: getApp().globalData.openid,
        //       life_pic: life_pic
        //     }
        //   })
        // }

        // ))
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          txbox: []
        })
      })

    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var _this = this;
    // wx.cloud.callFunction({
    //   name: 'cloud_funcs',
    //   data: {
    //     action: 'request_trainers_intro',
    //   },
    //   success: function (res) {
    //     console.log('[云函数] [request_trainers_intro] 调用成功：', res)
    //     var givenback = res.result.data;
    //     let setn = new Set();
    //     for (let i = 0; i < givenback.length; i++) {

    //       if (givenback[i].openid == getApp().globalData.openid) {
    //         img_box = [];

    //         for (let ii = 0; ii < givenback[i].life_pic.length; ii++) {
    //           let dp= wx.cloud.downloadFile({
    //             fileID: givenback[i].life_pic[ii]
    //           })
    //           img_box.push(dp.tempFilePath)
    //         }

    //         _this.setData({ img_box: img_box });
    //       }
    //     }

    //   },
    //   fail: function (res) {
    //   }
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