// miniprogram/pages/trainers/Introduction.js
// https://juejin.im/post/5ceabae751882520724c74bc

Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    title:"牛奶",
    Default_Intro:"告诉你一个秘密，我是一个很厉害的教练",
    expand_text:"查看更多",
    hide_text:"收起",
    btn_text:"查看更多",

    // selected: [true, true,true,true,true,true,true,true,true,true], // 
    active: null

  },

  clickName:async function(options){
    var that=this;
    let index = options.currentTarget.dataset.index;
    let active = this.data.active;
    if (this.__data__.selected[index]==true){
      console.log('点击查看', options.currentTarget.dataset.item.nick_name, '的照片')

    }else{
      console.log('关闭查看', options.currentTarget.dataset.item.nick_name, '的照片')

    }
    
    var pics_address=options.currentTarget.dataset.item.life_pic;

    let promiseArr = [];

    for (let i = 0; i < pics_address.length;i++){
      await wx.cloud.downloadFile({
        fileID: pics_address[i]
      }).then(res => {
        // get temp file path
        promiseArr.push(res.tempFilePath)
        // console.log('下载下来了',res.tempFilePath)
      }).catch(error => {
      })
    }
    // console.log('promiseArr', promiseArr)
    this.__data__.trainers_intro[index].life_pic = promiseArr

    this.setData({
      [`selected[${index}]`]: !this.data.selected[`${index}`],
      active: index,
    });


    // 如果点击的不是当前展开的项，则关闭当前展开的项
    // 这里就实现了点击一项，隐藏另一项
    if (active !== null && active !== index) {
      this.setData({ [`selected[${active}]`]: true });
    }

    
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_trainers_intro',
      },
      success: function (res) {
        console.log('[云函数] [request_trainers_intro] 调用成功：成功下载教练个人信息', res)
        var givenback = res.result.data;
        let setn = new Set();
        var selected = []
        for(let i=0;i<givenback.length;i++){
          selected.push(true);
        }
        _this.setData({ 
          trainers_intro: givenback,
          selected:selected 
        });
        
      },
      fail: function (res) {
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
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




