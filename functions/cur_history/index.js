// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate()+1;//这里要改啊,不应该有后面的+1//////////////////////////////////////////
  var time=year*1000000+month*10000+day*100

  const MAX_LIMIT = 10
  var db = cloud.database()
  const _ = db.command
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []


  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({ time: _.lt(time) }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let values = await Promise.all(tasks);
  sleep(1)
  if (values.length == 0) {
    return
  }
  let input = values[0].data

  for (let i = 0; i < input.length; i++) {

    await db.collection('Trainers_history_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).get().then(res => {
      if (res.data.length == 0) {
        db.collection('Trainers_history_test').add({
          data: {
            jlid: input[i].jlid,
            rate: input[i].rate,
            time: input[i].time,
            timeperiod: input[i].timeperiod,
            xyid: input[i].xyid,
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
      else {
        console.log('这一条似乎有了', res)
      }
    })
    await db.collection('Trainers_cur_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).remove()
  }














}





















async function cur_history(event,time) {
  //可能比较多
  
  const MAX_LIMIT = 10
  var db = cloud.database()
  const _ = db.command
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []


  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({ time: _.lt(time) }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let values = await Promise.all(tasks);
  sleep(1)
  if (values.length == 0) {
    return
  }
  let input=values[0].data
  
  
  for (let i = 0; i < input.length;i++){
    
    await db.collection('Trainers_history_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).get().then(res => {
        if (res.data.length == 0) {
          db.collection('Trainers_history_test').add({
            data: {
              jlid: input[i].jlid,
              rate: input[i].rate,
              time: input[i].time,
              timeperiod: input[i].timeperiod,
              xyid: input[i].xyid,
            },
            success: function (res) {
              console.log(res)
            }
          })
        }
        else {
          console.log('这一条似乎有了',res)
        }
      })
    // db.collection('Trainers_history_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).get()  
    await db.collection('Trainers_cur_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).remove()
    // db.collection('Trainers_history_test').where({ jlid: input[i].jlid, time: _.eq(input[i].time) }).get()  
  }
  // let mm = await db.collection('Trainers_cur_test').where({ jlid: input[0].jlid, time: _.eq(input[0].time) }).get()  
}

async function cur_log(event, time){
  
  var db = cloud.database()
  const _ = db.command

  let jldata=await db.collection('Status_check_test').where({status:2}).get()
  let xydata = await db.collection('Status_check_test').where({ status: 1 }).get()
  let jllist=jldata.data
  let xylist=xydata.data

  var weekbefore = new Date();
  weekbefore.setDate(weekbefore.getDate() - 7);
  var year = weekbefore.getFullYear();
  var month = weekbefore.getMonth() + 1;
  var day = weekbefore.getDate();//这里要改啊
  var weekbeforetime = year * 1000000 + month * 10000 + day * 100 + 100
  
  var monthbefore = new Date();
  monthbefore.setDate(monthbefore.getDate() - 30);
  var year = monthbefore.getFullYear();
  var month = monthbefore.getMonth() + 1;
  var day = monthbefore.getDate();//这里要改啊
  var monthbeforetime = year * 1000000 + month * 10000 + day * 100 + 100

  
  for (let i = 0; i < jllist.length; i++){
    const weeknum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(weekbeforetime) }).count()
    const monthnum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(monthbeforetime) }).count()
    const total = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid }).count()

    db.collection('Log').where({ openid: jllist[i].openid, status: 2}).get().then(res => {
      if (res.data.length != 0) {
        db.collection('Log').where({ openid: jllist[i].openid, status: 2 }).update({
          data: {
            openid: jllist[i].openid,
            status: 2,
            weeknum: weeknum.total,
            monthnum: monthnum.total,
            total: total.total
          },
          success: function (res) {
            console.log(res.data)
          },
        })
      }
      else {
        db.collection('Log').add({
          data: {
            openid: jllist[i].openid,
            status: 2,
            weeknum: weeknum.total,
            monthnum: monthnum.total,
            total: total.total
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  }

  for (let i = 0; i < xylist.length; i++) {
    const weeknum = await db.collection('Trainers_history_test').where({ xyid: xylist[i].openid, time: _.gt(weekbeforetime) }).count()
    const monthnum = await db.collection('Trainers_history_test').where({ xyid: xylist[i].openid, time: _.gt(monthbeforetime) }).count()
    const total = await db.collection('Trainers_history_test').where({ xyid: xylist[i].openid }).count()

    db.collection('Log').where({ openid: xylist[i].openid, status: 1 }).get().then(res => {
      if (res.data.length != 0) {
        db.collection('Log').where({ openid: xylist[i].openid, status: 1 }).update({
          data: {
            openid: xylist[i].openid,
            status: 1,
            weeknum: weeknum.total,
            monthnum: monthnum.total,
            total: total.total
          },
          success: function (res) {
            console.log(res.data)
          },
        })
      }
      else {
        db.collection('Log').add({
          data: {
            openid: xylist[i].openid,
            status: 1,
            weeknum: weeknum.total,
            monthnum: monthnum.total,
            total: total.total
          },
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  }



}

var sleep = function (time) {
  var startTime = new Date().getTime() + parseInt(time, 10);
  while (new Date().getTime() < startTime) { }
}