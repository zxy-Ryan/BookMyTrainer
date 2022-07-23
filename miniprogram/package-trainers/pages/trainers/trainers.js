// pages/trainers/trainers.js
var weeksArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainers: [
      { id: 1, name: '李超' },
      { id: 2, name: '莉娜' },
    ],


    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,

    clicked: false
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nick_name = options.nick_name;
    this.setData({ nick_name: nick_name })
    let _this=this
    wx.cloud.callFunction({
      name: 'cloud_funcs',
      data: {
        action: 'request_trainee_list',
        openid: options.openid
      },
      success: function (res) {
        console.log('[云函数] [request_trainee_list] 调用成功：', res)
        var givenback = res.result;
        // console.log('[云函数] [request_trainee_list] 调用成功：', res)
        let setn = new Array();
        for (let i = 0; i < givenback.length; i++) {
          setn[givenback[i].time] = givenback[i].memo
        }
        console.log('已经被占用的时间', setn)
        var daysArray = getSevenDays();
        _this.setData({ dateArray: daysArray });
        var scheduleList = getEachDays(daysArray, setn);
        _this.setData({ sch_listData: scheduleList });
      },
      fail: function (res) {
        let setn = new Set();
        console.log('[云函数] [request_trainee_list] 调用失败：', setn)
        var daysArray = getSevenDays();
        _this.setData({ dateArray: daysArray });
        var scheduleList = getEachDays(daysArray, setn);
        _this.setData({ sch_listData: scheduleList });
      }
    })

  },

  updatepic:function(options){
    wx.navigateTo({
      url: './update/test/test',
    })
  },

  updateIntro: function (options) {
    wx.navigateTo({
      url: './update/update',
    })
  },

  showSchedule: function (options) {
    let clicked =this.data.clicked;
    this.setData({clicked: !clicked});
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

  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },

  datePickerOnSureClick: function (e) {
    console.log('datePickerOnSureClick');
    console.log(e);
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
    });
  },

  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
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
    var date = newDate.getFullYear() + m + d;

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
    dayDict = { "date_text": dayStr, "weekName": getWeekByDay(time), "weekNum": weekNum, "dateall": date };

    //console.log("date_text:" + dayStr + "weekName:" + getWeekByDay(time) + "weekNum:" + weekNum)
    daysArray.push(dayDict);
  }

  var weeksArray = daysArray;
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

var getEachDays = function (daysArray, set) {
  var dayDict = {}
  //var week = ["Mon_text", "Tues_text"]
  var morning_period = ["08", "09", "10", "11"]
  var Morning_Period = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00"]
  var afternoon_period = ["12", "13", "14", "15", "16", "17"]
  var Afternoon_Period = ["12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"]
  var night_period = ["18", "19", "20", "21", "22"]
  var Night_Period = ["18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00"]
  var result = [{ time_title: '上午', daily: [] }, { time_title: '下午', daily: [] }, { time_title: '晚上', daily: [] }]
  for (var i = 0; i < daysArray.length; i++) {
    var push_in = [];
    for (var j = 0; j < morning_period.length; j++) {
      // const time = Number(daysArray[i].dateall + morning_period[j]);
      if (set[daysArray[i].dateall + morning_period[j]]) {
        push_in.push({
          time: daysArray[i].dateall + morning_period[j],
          available: false,
          xyname: set[daysArray[i].dateall + morning_period[j]] + "(" + Morning_Period[j] + ")",
          weekName: daysArray[i].weekName
        })
      }
      else {
        push_in.push({
          time: daysArray[i].dateall + morning_period[j],
          available: true,
          xyname: '..',
          weekName: daysArray[i].weekName
        })
      }

    }
    result[0].daily.push(push_in)


    var push_in = [];
    for (var j = 0; j < afternoon_period.length; j++) {
      // const time = Number(daysArray[i].dateall + afternoon_period[j]);
      if (set[daysArray[i].dateall + afternoon_period[j]]) {
        push_in.push({
          time: daysArray[i].dateall + afternoon_period[j],
          available: false,
          xyname: set[daysArray[i].dateall + afternoon_period[j]] + "(" + Afternoon_Period[j] + ")",
          weekName: daysArray[i].weekName
        })
      }
      else {
        push_in.push({ time: daysArray[i].dateall + afternoon_period[j], available: true, xyname: '..', weekName: daysArray[i].weekName })
      }
    }
    result[1].daily.push(push_in)


    var push_in = [];
    for (var j = 0; j < night_period.length; j++) {
      // const time = Number(daysArray[i].dateall + night_period[j])
      if (set[daysArray[i].dateall + night_period[j]]) {
        push_in.push({
          time: daysArray[i].dateall + night_period[j], available: false,
          xyname: set[daysArray[i].dateall + night_period[j]] + "(" + Night_Period[j] + ")",
          weekName: daysArray[i].weekName
        })
      }
      else {
        push_in.push({ time: daysArray[i].dateall + night_period[j], available: true, xyname: '..', weekName: daysArray[i].weekName })
      }

    }
    result[2].daily.push(push_in)

  }
  return result;
}