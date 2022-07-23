// miniprogram/pages/boss/add_gym_pic/add_gym_pic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值

    actbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值

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

    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('这里的res',res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var sizethis=res.tempFiles[0].size;
        var qua=100;
        if (sizethis>10000){
          qua=20;
        }else{
          if(sizethis>1000){
            qua=50;
          }else{
            if(sizethis>300){
              qua=80;
            }
          }
        }
        console.log('qua',qua)
        wx.compressImage({
          src: tempFilePaths[0], // 图片路径
          quality: qua, // 压缩质量
          success: res => {
            console.log('compressed以后res啥样',res)
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
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },


  //发布按钮
  fb: function (e) {
    var that=this;
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      wx.showLoading({
        title: '上传中',
      })
      
      wx.cloud.callFunction({
        name: 'synchro_funcs',
        data: {
          action: 'delete_Intro',
        }
      })
      var compressedimgbox=[];




      let promiseArr = [];
      for (let i = 0; i < this.data.imgbox.length; i++) {
        var prom = new Promise((reslove, reject) => {
          let item = this.data.imgbox[i];
          console.log('item里面是啥', item);
          let suffix = 'GymPic/Intro_' + String(i + 1);//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            
            success: res => {
              
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              // this.setData({
              //   fileIDs: this.data.fileIDs.concat(res.tempFilePath)
              // });
              console.log('res是什么？', res)//输出上传后图片的返回地址
              wx.cloud.callFunction({
                name: 'synchro_funcs',
                data: {
                  action: 'add_Intro',
                  Intro: res.fileID
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
          });
        promiseArr.push(prom)
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox: []
        })
      }) 
    }
  },



  // 删除照片 &&
  actDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let actbox = this.data.actbox;
    actbox.splice(index, 1)
    that.setData({
      actbox: actbox
    });
  },

  // 选择图片 &&&
  actaddPic1: function (e) {

    var actbox = this.data.actbox;
    console.log(actbox)
    var that = this;
    var n = 5;
    if (5 > actbox.length > 0) {
      n = 5 - actbox.length;
    } else if (actbox.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('这里的res', res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为act标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var sizethis = res.tempFiles[0].size;
        var qua=givequa(sizethis);
        
        console.log('qua', qua)
        wx.compressImage({
          src: tempFilePaths[0], // 图片路径
          quality: qua, // 压缩质量
          success: res => {
            console.log('compressed以后res啥样', res)
            console.log('compressed以后res啥样', actbox)
            if (actbox.length == 0) {
              actbox = [res.tempFilePath]
            } else if (5 > actbox.length) {
              actbox = actbox.concat(res.tempFilePath);
            }
            that.setData({
              actbox: actbox
            });
          }
        })
      }
    })
  },

  //图片
  actbox: function (e) {
    this.setData({
      actbox: e.detail.value
    })
  },


  //发布按钮
  actfb: function (e) {
    var that = this;
    if (!this.data.actbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      wx.showLoading({
        title: '上传中',
      })

      wx.cloud.callFunction({
        name: 'synchro_funcs',
        data: {
          action: 'delete_advertise',
        }
      })
      var compressedactbox = [];

      let promiseArr = [];
      for (let i = 0; i < this.data.actbox.length; i++) {
        var prom = new Promise((reslove, reject) => {
          let item = this.data.actbox[i];
          console.log('item里面是啥', item);
          let suffix = 'GymPic/Advertise_' + String(i + 1);//正则表达式返回文件的扩展名
          wx.cloud.uploadFile({
            cloudPath: suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              // this.setData({
              //   fileIDs: this.data.fileIDs.concat(res.tempFilePath)
              // });
              console.log('res是什么？', res)//输出上传后图片的返回地址
              wx.cloud.callFunction({
                name: 'synchro_funcs',
                data: {
                  action: 'add_advertise',
                  advertise: res.fileID
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
        });
        promiseArr.push(prom)
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          actbox: []
        })
      })
    }
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
})
var givequa = function (sizethis) {
  if(sizethis<500){
    return 100;
  }
  if(sizethis<3000){
    return 70;
  }
  if(sizethis<10000){
    return 40;
  }
  if(sizethis<100000){
    return 10;
  }
  return 5;
}