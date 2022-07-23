// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  throwOnNotFound: false
})

const _ = db.command

// 云函数入口函数
exports.main =  (event, context) => {
  switch (event.action) {
    case 'add_up_reservation': {
      return add_up_reservation(event)
    }
    case'update_trainerinfo':{
      return update_trainerinfo(event)
    }
    case 'update_memo_avatarUrl':{
      return update_memo_avatarUrl(event)
    }
    case 'add_lifepic':{
      return add_lifepic(event)
    }
    case 'delete_lifepic':{
      return delete_lifepic(event)
    }
    case 'add_Intro': {
      return add_Intro(event)
    }
    case 'delete_Intro': {
      return delete_Intro(event)
    }
    case 'add_advertise': {
      return add_advertise(event)
    }
    case 'delete_advertise': {
      return delete_advertise(event)
    }
  }

  
}

function add_up_reservation(event) {
  // var db = cloud.database()
  // const _ = db.command
  // db.collection('Status_check_test').where({ openid: event.xyid }).update({
  //   data: {
  //     res_class_num: _.inc(-1)
  //   },
  // })



  let flag = false
  console.log('event到这里是个啥', event);
  db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get().then(res => {
    if (res.data.length != 0) {
      return false;
      // resolve(false)
    }
    else {
      db.collection('Trainers_cur_test').add({
        data: {
          jlid: event.jlid,
          time: event.time,
          xyid: event.xyid,
          rate: [11, 11],
          timeperiod: event.timeperiod
        }
      })
      return true;
    }
  });
}


function update_trainerinfo(event){
  let flag = false
  console.log('event到这里是个啥', event);
  db.collection('Status_check_test').where({ openid: event.openid, status: 2 }).update({
    data: {
      memo_avatarUrl: event.memo_avatarUrl,
      Introduction: event.content,
    },
  })
  return
}



function update_memo_avatarUrl(event) {
  let flag = false
  db.collection('Status_check_test').where({ openid: event.openid, status: 2 }).update({
    data: {
      memo_avatarUrl: event.memo_avatarUrl,
    },
  })
  return
}

function delete_lifepic(event){
  const _ = db.command
  db.collection('Status_check_test').where({ openid: event.openid, status: 2 }).update({
    data: {
      life_pic: [],
    },
  })
  return
}

function add_lifepic(event) {
  const _ = db.command
  let flag = false
  db.collection('Status_check_test').where({ openid: event.openid, status: 2 }).update({
    data: {
      life_pic: _.push(event.life_pic),
    },
  })
  return
}

async function delete_Intro(event) {
  const _ = db.command
  await db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c"}).update({
    data: {
      Intro: [],
    },
  })
  return
}

async function add_Intro(event) {
  const _ = db.command
  let flag = false
  let m = await db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c" }).get()
  await db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c"}).update({
    data: {
      Intro: _.push(event.Intro),
    },
  })
  return
}

function delete_advertise(event) {
  const _ = db.command
  db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c" }).update({
    data: {
      advertise: [],
    },
  })
  return
}

function add_advertise(event) {
  const _ = db.command
  let flag = false
  db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c" }).update({
    data: {
      advertise: _.push(event.advertise),
    },
  })
  return
}