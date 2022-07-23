// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  const wxContext = cloud.getWXContext()
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();//这里要改啊
  var time = year * 1000000 + month * 10000 + day * 100 + 100
  
  var db = cloud.database()
  const _ = db.command

  let jldata = await db.collection('Status_check_test').where({ status: 2 }).get()
  let xydata = await db.collection('Status_check_test').where({ status: 1 }).get()
  let jllist = jldata.data
  let xylist = xydata.data

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


  for (let i = 0; i < jllist.length; i++) {
    const weeknum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(weekbeforetime) }).count()
    const monthnum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(monthbeforetime) }).count()
    const total = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid }).count()

    db.collection('Log').where({ openid: jllist[i].openid, status: 2 }).get().then(res => {
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

  var pics = []; 
  for (let i = 0; i < jllist.length; i++) {
    for (let j = 0; j < jllist[i].life_pic.length;j++){
      pics.push(jllist[i].life_pic[j]);
    }
  }
  let firstPage = await db.collection('FirstPagePic').get()
  var Intro=firstPage.data[0].Intro
  var advertise = firstPage.data[0].advertise
  for (let i=0;i<Intro.length;i++){
    pics.push(Intro[i])
  }
  for (let i = 0; i < advertise.length; i++) {
    pics.push(advertise[i])
  }
  console.log(pics)

  result = await cloud.getTempFileURL({
    fileList: [pics[0]],
    })
  let unavailable = new Array();
  for (let i=0;i<pics.length;i++){
    const result = await cloud.getTempFileURL({
      fileList: [pics[i]],
    })
    if (result.fileList[0].tempFileURL==""){
      unavailable.push(pics[i])
    }
    console.log(result)

  }
  console.log(unavailable)
  Intro=update(Intro,unavailable)
  advertise = update(advertise,unavailable)

  for (let i = 0; i < jllist.length; i++) {
    jllist[i].life_pic = await update(jllist[i].life_pic, unavailable);
  }

  for (let i = 0; i < jllist.length; i++) {
    await db.collection('Status_check_test').where({ openid: jllist[i].openid, status: 2 }).update({
          data: {
            life_pic: jllist[i].life_pic
          },
          success: function (res) {
            console.log(res.data)
          },
        })
  }

  await db.collection('Status_check_test').where({ openid: jllist[i].openid, status: 2 }).update({
    data: {
      life_pic: jllist[i].life_pic
    },
    success: function (res) {
      console.log(res.data)
    },
  })

  await db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c" }).update({
    data: {
      Intro: Intro,
      advertise: advertise
    },
    success: function (res) {
      console.log(res.data)
    },
  })

  return 
}


function update(origin,unavailable){
  var index=[];
  for(let i=0;i<origin.length;i++){
    if (unavailable.indexOf(origin[i])!=-1){
      index.push(i);
    }
  }
  for(let i=index.length-1;i>=0;i--){
    origin.pop(index[i]);
  }
  return origin
}


//这里最好不要这么嵌套
async function cur_log(event, time) {

  var db = cloud.database()
  const _ = db.command

  let jldata = await db.collection('Status_check_test').where({ status: 2 }).get()
  let xydata = await db.collection('Status_check_test').where({ status: 1 }).get()
  let jllist = jldata.data
  let xylist = xydata.data

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


  for (let i = 0; i < jllist.length; i++) {
    const weeknum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(weekbeforetime) }).count()
    const monthnum = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid, time: _.gt(monthbeforetime) }).count()
    const total = await db.collection('Trainers_history_test').where({ jlid: jllist[i].openid }).count()

    db.collection('Log').where({ openid: jllist[i].openid, status: 2 }).get().then(res => {
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
  return 



}