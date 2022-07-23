// pages/trainees/Reservation/Reservation.js
var weeksArray = [];



Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto:'Hello World',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nick_name = options.nick_name;
    var _this = this;
    this.setData({ nick_name: nick_name})
    this.setData({ openid: options.openid })
    console.log('教练名字和昵称',options)
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_unavailable_time',
        openid: options.openid,
        xyid: getApp().globalData.openid
      },
      success: function(res)  {
        console.log('[云函数] [request_unavailable_time] 调用成功：', res)
        var givenback = res.result.data;
        let setn = new Set();
        for(let i=0;i<givenback.length;i++){
          setn.add(givenback[i].time)
        }
        console.log('已经被占用的时间',setn)
        var daysArray = getSevenDays();
        _this.setData({dateArray: daysArray});
        var scheduleList = getEachDays(daysArray,setn);
        _this.setData({sch_listData:scheduleList});
      },
      fail:function(res){
        let setn = new Set();
        console.log('已经被占用的时间', setn)
        var daysArray = getSevenDays();
        _this.setData({ dateArray: daysArray });
        var scheduleList = getEachDays(daysArray, setn);
        _this.setData({ sch_listData: scheduleList });

      }
      
    })

    //console.log('这啥', nick_name)
    // for(let i=0;i<this.unavailable.data.length;i++){
    //   set.add(this.unavailable[data][i].time)
    // }
    // this.setData({set_unavailble:set})



    
    // var daysArray = getSevenDays();
    // this.setData({dateArray: daysArray});


    
    
    
    // var scheduleList = getEachDays(daysArray);
    // this.setData({sch_listData:scheduleList});
    

    
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

  clickreserve:async function(e){
    var that=this
    var periodstring = ''
    var stringtime = String(e.currentTarget.dataset.time)
    periodstring = stringtime.substring(0, 4) + '年' + String(Number(stringtime.substring(4, 6))) + '月' + String(Number(stringtime.substring(6, 8))) + '日' + String(Number(stringtime.substring(8, 10))) + ':00-' + String(Number(stringtime.substring(8, 10)) + 1) + ':00'
    console.log('传进来的参数1：', periodstring)
    e.currentTarget.dataset.periodstring = periodstring
    console.log('event是个啥',e)
    if (!e.currentTarget.dataset.flag){
      wx.showModal({
        title: 'Sorry',
        duration: 3000,//显示时长
        content: "您预约的时间有人占啦",
      })
    }  
    else {
      wx.showModal({
        title: '确认预约信息',
        duration: 2000,//显示时长
        content: "您预约的是" + e.currentTarget.dataset.weekname + "的" + e.currentTarget.dataset.timeperiod+"?",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定', periodstring)
            Promise.all([addupreservation(e, periodstring)]).then(() => {
              wx.navigateBack({
              })
              // wx.navigateTo({
              // url: './Reservation?openid=' + that.data.openid + '&nick_name=' + that.data.nick_name
              //  })

              })
          }}
      })
    }
    
        



        
        //reset($dict.time, $dict.jlid)//重置
      
      
    

    


  }


})

var getSevenDays = function () {
  var daysArray = [];
  var dayDict = {};
  var weekStr = '';
  var weekNum = '';

  for (var i = 0; i < 7; i++) {
    var date = new Date(); //当前日期
    var newDate = new Date();
    newDate.setDate(date.getDate() + i);

    var m = (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    var d = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();

    var time = newDate.getFullYear() + "-" + m + "-" + d;
    var dayStr = m + "/" + d;
    var date = newDate.getFullYear()+m+d;

    if (getWeekByDay(time) == '周一') {
      weekNum = 0;
    } else if (getWeekByDay(time) == '周二') {
      weekNum = 1;
    } else if (getWeekByDay(time) == '周三') {
      weekNum = 2;
    } else if (getWeekByDay(time) == '周四') {
      weekNum = 3;
    } else if (getWeekByDay(time) == '周五') {
      weekNum = 4;
    } else if (getWeekByDay(time) == '周六') {
      weekNum = 5;
    } else if (getWeekByDay(time) == '周日') {
      weekNum = 6;
    }
    dayDict = { "date_text": dayStr, "weekName": getWeekByDay(time), "weekNum": weekNum ,"dateall":date};

    //console.log("date_text:" + dayStr + "weekName:" + getWeekByDay(time) + "weekNum:" + weekNum)
    daysArray.push(dayDict);
  }

  weeksArray = daysArray;
  return daysArray;
}

var getWeekByDay = function (dayValue) {
  var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
  var d = new Date();

  var year = d.getDate();

  // var month = d.getMonth() + 1;

  // var day = d.getDate();
  
  // console.log('让我看看day啥样',year)
  var today = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六"); //创建星期数组  
  //var today = new Array("周一", "周二", "周三", "周四", "周五", "周六","周日", ); //只用于周一开发，创建星期数组  
  return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日  
}

var getEachDays = function (daysArray,set){
  var dayDict = {}
  //var week = ["Mon_text", "Tues_text"]
  var morning_period = ["08", "09", "10", "11"]
  var Morning_Period = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00"]
  var afternoon_period = ["12", "13", "14", "15", "16", "17"]
  var Afternoon_Period = ["12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00","16:00-17:00","17:00-18:00"]
  var night_period = ["18", "19", "20", "21", "22"]
  var Night_Period = ["18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00","22:00-23:00"]
  var result = [{ time_title: '上午',daily:[]}, {time_title:'下午',daily:[]}, { time_title:'晚上',daily:[]}]
  for (var i = 0; i < daysArray.length; i++) {
    var push_in=[];
    for(var j=0;j<morning_period.length;j++){
      const time=Number(daysArray[i].dateall+morning_period[j]);
      if (set.has(time)){
        push_in.push({ time: time, available: false, timePeriod: Morning_Period[j], weekName: daysArray[i].weekName})
      }
      else{
        push_in.push({ time: time, available: true, timePeriod: Morning_Period[j], weekName: daysArray[i].weekName })
      }
      
    }
    result[0].daily.push(push_in)


    var push_in = [];
    for (var j = 0; j < afternoon_period.length; j++) {
      const time = Number(daysArray[i].dateall + afternoon_period[j]);
      if (set.has(time)) {
        push_in.push({ time: time, available: false, timePeriod: Afternoon_Period[j], weekName: daysArray[i].weekName })
      }
      else {
        push_in.push({ time: time, available: true, timePeriod: Afternoon_Period[j], weekName: daysArray[i].weekName })
      }
    }
    result[1].daily.push(push_in)


    var push_in = [];
    for (var j = 0; j < night_period.length; j++) {
      const time = Number(daysArray[i].dateall + night_period[j]);
      if (set.has(time)) {
        push_in.push({ time: time, available: false, timePeriod: Night_Period[j], weekName: daysArray[i].weekName })
      }
      else {
        push_in.push({ time: time, available: true, timePeriod: Night_Period[j], weekName: daysArray[i].weekName })
      }

    }
    result[2].daily.push(push_in)

  }



  return result;
}


// clickreserve:async function(e)

// var add_up_reservation = function (event, periodstring){
async function addupreservation(event, periodstring) {
  
  var time = event.currentTarget.dataset.time
  var jlid = event.currentTarget.dataset.jlid
  //const stringtime=String(time)
  console.log('event到这里hahaha是个啥', event)
  // const db = wx.cloud.database()
  // const _ = db.command

  // await db.collection('Status_check_test').where({ openid: event.xyid }).update({
  //   data: {
  //     res_class_num: _.inc(-1)
  //   },
  // })

  

  wx.cloud.callFunction({
    //  name:'synchro_funcs',
    name: 'cloud_funcs',
    data: {
      action: 'add_up_reservation',
      time: event.currentTarget.dataset.time,
      jlid: event.currentTarget.dataset.jlid,
      xyid: getApp().globalData.openid,
      //timeperiod: event.currentTarget.dataset.periodstring
      timeperiod: periodstring
    }
  }).then(res=>{
    console.log('res是啥',res)
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('Trainers_cur_test').where({ jlid: event.currentTarget.dataset.jlid, time: event.currentTarget.dataset.time, xyid: getApp().globalData.openid }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
        if(res.data.length>0){
          wx.showModal({
          title: '恭喜',
          duration: 3000,//显示时长
          showCancel: false,
          content: "您已经预约" + event.currentTarget.dataset.timeperiod,
        })
        }
        else{
          wx.showModal({
          title: 'Sorry',
          duration: 3000,//显示时长
          content: "您预约的时间有人占啦",
        })
        }
      }
    })
    
    // if (res.result) {
    //     wx.showModal({
    //       title: '恭喜',
    //       duration: 3000,//显示时长
    //       showCancel: false,
    //       content: "您已经预约" + event.currentTarget.dataset.timeperiod,
    //     })
    //   }
    //   else{
    //     wx.showModal({
    //       title: 'Sorry',
    //       duration: 3000,//显示时长
    //       content: "您预约的时间有人占啦",
    //     })
    //   }

  }).catch(err=>{
    console.log(err)

  })













    // name: 'cloud_funcs',
    // name:'add_up_reservation',
    // data: {
    //   action: 'add_up_reservation',
    //   time: event.currentTarget.dataset.time,
    //   jlid: event.currentTarget.dataset.jlid,
    //   xyid: getApp().globalData.openid,
    //   //timeperiod: event.currentTarget.dataset.periodstring
    //   timeperiod: periodstring
    // },
    // success: function (res) {
    //   console.log('[云函数] [add_up_reservation] 调用成功：', res)
    //   var flag=res;
    //   if(res.result){
    //     wx.showModal({
    //       title: '恭喜',
    //       duration: 3000,//显示时长
    //       showCancel: false,
    //       content: "您已经预约" + event.currentTarget.dataset.timeperiod,
    //     })
    //   }
    //   else{
    //     wx.showModal({
    //       title: 'Sorry',
    //       duration: 3000,//显示时长
    //       content: "您预约的时间有人占啦",
    //     })
    //   }
    // },
    // fail:function(err){
    //   console.log('[云函数] [add_up_reservation] 调用失败：',err)
    // }})
  


}

var refresh =function(){
  console.log("that",that)
  console.log("this",this)
  var that=this
  
}