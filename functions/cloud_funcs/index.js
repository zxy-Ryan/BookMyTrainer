// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  throwOnNotFound: false
})


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'transfer_from_request': {
      return transfer_from_request(event)
    }
    case 'request_list': {//
      return request_list(event)
    }
    case 'request_trainers_list':{//读取教练列表
      return request_trainers_list(event)
    }
    case 'request_unavailable_time':{
      return request_unavailable_time(event)
    }
    case 'add_up_reservation':{
      return add_up_reservation(event)
    }
    case 'request_appoint_time': {
      return request_appoint_time(event)
    }
    case 'cancel_reservation':{
      return cancel_reservation(event)
    }
    case 'request_trainee_list':{
      return request_trainee_list(event)
    }
    case 'request_trainers_intro':{
      return request_trainers_intro(event)
    }
    case 'request_log':{
      return request_log(event)
    }
    case 'request_all_log':{
      return request_all_log(event)
    }
    case 'request_res_class':{
      return request_res_class(event)
    }
    case 'request_xylist':{
      return request_xylist(event)
    }
    case 'change_class_num':{
      return change_class_num(event)
    }
    case 'deleteperson':{
      return deleteperson(event)
    }
    case 'occupany':{
      return occupany(event)
    }
    case 'request_gym_intro':{
      return request_gym_intro(event)
    }
    case 'request_gym_advertise':{
      return request_gym_advertise(event)
    }
    case 'request_cancel_list':{
      return request_cancel_list(event)
    }
    case 'update_key':{
      return update_key(event)
    }

  }
}

async function update_key(event){
  var db=cloud.database()


  await db.collection('FirstPagePic').where({ _id: "463448e05eca6763002174f9392fe49c" }).update({
    data: {
      Key: event.key
    },
    success: function (res) {
      console.log(res.data)
    },
  })
}

async function request_gym_intro(event){
  var db = cloud.database()
  return await db.collection('FirstPagePic').get()
}



async function occupany(event) {
  //可能比较多
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}

async function deleteperson(event){
  var db = cloud.database()
  console.log('event:', event)
  await db.collection('Status_check_test').where({ openid: event.openid, status: event.status }).remove({
      success: function (res) {
        console.log(res.data)
      }
    })
  return 
}


async function change_class_num(event){
  var db=cloud.database()
  console.log('event:',event)
  const _ = db.command
  if (event.setnum!=-1){
    await db.collection('Status_check_test').where({ openid: event.openid, status: 1 }).update({
      data: {
        res_class_num: event.setnum
      },
      success: function (res) {
        console.log(res.data)
      },
    })
  }else{
    await db.collection('Status_check_test').where({ openid: event.openid, status: 1 }).update({
      data: {
        res_class_num: _.inc(event.addupnum)
      },
      success: function (res) {
        console.log(res.data)
      },
    })

  }

}



async function request_xylist(event) {
  var db = cloud.database()
  try {
    data_list = await db.collection('Status_check_test').where({ status: 1 }).get()
  } catch (e) {
    console.error(e)
  }
  return data_list.data
}





async function request_res_class(event) {
  var db = cloud.database()

  try {
    data_list = await db.collection('Status_check_test').where({ openid: event.openid,status:1 }).get()
  } catch (e) {
    console.error(e)
  }
  return data_list.data
}


async function request_log(event) {
  var db = cloud.database()

  try {
    data_list = await db.collection('Log').where({ openid: event.openid, status: 1}).get()
  } catch (e) {
    console.error(e)
  }
  return data_list.data
}

async function request_all_log(event) {
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Log').count()

  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Log').where({ openid: event.openid, status: 1 }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}








async function request_trainers_intro(event) {
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Status_check_test').count()
  // const countResultnew = await db.collection('Trainers_cur_test').where({ status: 2 }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Status_check_test').where({ status: 2 }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))

}










async function transfer_from_request(event) {
  const openid = event.open_id
  const status = event.status
  const dataitems = await read_request(openid, status)
  const result1 = await write_to_status(openid, dataitems)
  sleep(1)
  // return result1 

}

async function request_list(event) {
  var db = cloud.database()

  try {
    data_list = await db.collection('Status_check_test').where({status: Number(event.status) }).get()
  } catch (e) {
    console.error(e)
  }
  return data_list.data
}


async function request_trainers_list(event) {
  //可能比较多
  const MAX_LIMIT=30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total/30)
  const tasks=[]
  for(let i=0;i<batchTimes;i++){
    const promise = db.collection('Trainers_cur_test').skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}


async function request_cancel_list(event) {
  
  let origindata = await origin_xydata(event);
  var diction_name = new Array();
  var db = cloud.database();
  for (let i = 0; i < origindata.data.length; i++) {
    if (!diction_name.hasOwnProperty(origindata.data[i].jlid)) {
      let res = await db.collection('Status_check_test').where({ openid: origindata.data[i].jlid, status: 2 }).get()
      if (res.data[0].hasOwnProperty('memo_name')){
        diction_name[origindata.data[i].xyid] = res.data[0].memo_name
      }
      else{
        diction_name[origindata.data[i].xyid] = res.data[0].nick_name
      }
      
      origindata.data[i]['memo'] = res.data[0].nick_name
    }
    else {
      origindata.data[i]['memo'] = diction_name[origindata.data[i].xyid]
    }
  }
  return origindata.data
}









async function request_trainee_list(event) {
  let origindata = await origin_data(event);
  var diction_name = new Array();
  var db = cloud.database();
  for (let i = 0; i < origindata.data.length; i++) {
    if (!diction_name.hasOwnProperty(origindata.data[i].xyid)) {
      let res = await db.collection('Status_check_test').where({ openid: origindata.data[i].xyid, status: 1 }).get()
      diction_name[origindata.data[i].xyid] = res.data[0].nick_name
      origindata.data[i]['memo'] = res.data[0].nick_name
    }
    else{
      origindata.data[i]['memo'] = diction_name[origindata.data[i].xyid]
    }
  }
  return origindata.data
}

async function origin_data(event){
  const openid = event.openid
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({ jlid: event.openid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}

async function origin_xydata(event) {
  const openid = event.openid
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({ xyid: event.openid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}

async function request_unavailable_time(event) {
  //可能比较多
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({ jlid: event.openid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
    const promise2 = db.collection('Trainers_cur_test').where({ xyid: event.xyid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise2)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))
}


async function add_up_reservation(event) {
  // 这个函数移动到synchro_funcs

  var db = cloud.database()
  let _ = db.command
  

  
  
  let flag = false
  console.log('event到这里是个啥', event);
  let num = await db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).count();
  if (num.total!=0){
    return false
  }
  else{
    await db.collection('Status_check_test').where({ openid: event.xyid }).update({
      data: {
        res_class_num: _.inc(-1)
      },
    })
    
    await db.collection('Trainers_cur_test').add({
      data: {
        jlid: event.jlid,
        time: event.time,
        xyid: event.xyid,
        timeperiod: event.timeperiod
      }
    })
    return true

  }

  // db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get().then(res => {
  //   if (res.data.length != 0) {
  //     return false
  //     // resolve(false)
  //   }
  //   else {
  //     db.collection('Trainers_cur_test').add({
  //       data: {
  //         jlid: event.jlid,
  //         time: event.time,
  //         xyid: event.xyid,
  //         timeperiod: event.timeperiod
  //       }
  //     })
  //     return true
  //   }
  // })
}



// async function add_up_reservation(event) {
//   //在Status_check里添加身份
//   var db = cloud.database()
//   const _ = db.command
//   //const _ = db.command
//   var flag=false
//   //const countResult = await db.collection('Trainers_cur_test').where({ jlid: event.jlid }, { time: _.eq(event.time) }).count()
//   console.log('event到这里是个啥', event)
//   const promise = db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get()
//   return (await promise.then(res => {
//     if (res.data.length != 0) {
//       return false;
//       // resolve(false)
//     }
//     else {
//       db.collection('Trainers_cur_test').add({
//         data: {
//           jlid: event.jlid,
//           time: event.time,
//           xyid: event.xyid,
//           rate: [11, 11],
//           timeperiod: event.timeperiod
//         }
//       })
//       return true;
//     }})
//     )








//   // await db.collection('Trainers_cur_test').where({ jlid: event.jlid,time: _.eq(event.time) })
//   //   .get().then(res => {
//   //     if (res.data.length != 0) {
//   //       return flag;
//   //       // resolve(false)
//   //     }
//   //     else {
//   //       db.collection('Trainers_cur_test').add({
//   //         data: {
//   //           jlid: event.jlid,
//   //           time: event.time,
//   //           xyid: event.xyid,
//   //           rate: [11, 11],
//   //           timeperiod: event.timeperiod
//   //         }
//   //       });
//   //       return true;
//   //       // resolve(true)
//   //     }
//   //   })



//   await db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get().then(res => {
//     console.log('数据位于列表中；')
//   })

//   await db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get().then(res => {
//     console.log('数据位于列表中；')
//   })

//   await db.collection('Trainers_cur_test').where({ jlid: event.jlid, time: _.eq(event.time) }).get().then(res => {
//     console.log('数据位于列表中；')
//   }) 
//   // return
// }

async function request_appoint_time(event) {
  //可能比较多
  const xyid=event.xyid
  const MAX_LIMIT = 30
  var db = cloud.database()
  const countResult = await db.collection('Trainers_cur_test').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 30)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('Trainers_cur_test').where({xyid:xyid}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  return (
    await Promise.all(tasks)).reduce((acc, cur) => ({
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }))

}

async function cancel_reservation(event) {
  var db = cloud.database()
  const _ = db.command
  await db.collection('Status_check_test').where({ openid: event.xyid,status:1}).update({
    data: {
      res_class_num: _.inc(1)
    },
  })
  
  // time: e.currentTarget.dataset.time,
  // xyid: getApp().globalData.openid,
  var flag = false
  let d = await db.collection('Trainers_cur_test').where({ xyid: event.xyid, time: _.eq(Number(event.time)) }).get()

  // return await db.collection('Trainers_cur_test').where({
  //   xyid: event.xyid, time: _.eq(Number(event.time))
  // }).remove()


  await db.collection('Trainers_cur_test').where({ xyid: event.xyid, time: _.eq(Number(event.time)) }).remove({
    success: function (res) {
      console.log('删除成功',res)
    }
  })
  return
  // return await db.collection('Trainers_cur_test').where({ xyid: event.xyid, time: _.eq(event.time) }).remove()
  // await db.collection('Trainers_cur_test').where({ xyid: event.jlid, time: _.eq(event.time) }).get().then(res => {
  //   console.log('数据不位于列表中；')
  // })
}




/*
belong to transfer_from_request
*/
async function read_request(openid, status) {
  var db = cloud.database()
  data_list = await db.collection('Request_check_test').where({ "_openid": openid, status: status }).get()
  return data_list.data[0]

}

async function write_to_status(openid, dataitems) {
  //在Status_check里添加身份
  var db = cloud.database()
  var loglog = '[云函数write_to_status]日志打印：' + dataitems.nick_name + '数据库添加：'
  await db.collection('Status_check_test').where({ status: dataitems.status, openid: openid }).get().then(res => {
    if (res.data.length != 0) {
      console.log('Status_check中已经添加过，')
      loglog = loglog + 'Status_check中已经添加过，'
    }
    else {
      // console.log(db.collection('Status_check_test'))
      db.collection('Status_check_test').add({
        data: {
          openid: openid,
          status: dataitems.status,
          nick_name: dataitems.nick_name,
          avatarUrl: dataitems.avatarUrl,
          memo_name: dataitems.memo_name,
          res_class_num:0
        }
      })
      loglog = loglog + 'Status_check中添加成功，'
    }
  })
  await db.collection('Request_check_test').where({ "_openid": openid }, { status: dataitems.status }).remove()

  // await db.collection('Status_check_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
  //   console.log('数据位于列表中；')
  //   loglog = loglog + '数据位于列表中；'
  // })
  // return loglog
}




async function write_to_record(openid, dataitems) {
  //在Trainers&Trainee里添加身份
  var db = cloud.database()
  var loglog = '[云函数write_to_record]日志打印：' + dataitems.nick_name + '数据库添加：'
  if(dataitems.status==1){//学员，Trainee_record中添加
    await db.collection('Trainee_record_test').where({ openid: openid }).get().then(res => {
      if (res.data.length != 0) {
        console.log('Trainee_record中已经添加过，')
        loglog = loglog + 'Trainee_record中已经添加过，'
      }
      else {
        // console.log(db.collection('Status_check_test'))
        db.collection('Trainee_record_test').add({
          data: {
            openid: openid,
            //status: dataitems.status,
            nick_name: dataitems.nick_name,
            avatarUrl: dataitems.avatarUrl
          }
        })
        loglog = loglog + 'Trainee_record中添加成功，'
      }
    })

    await db.collection('Trainee_record_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
      console.log('数据位于列表中；')
      loglog = loglog + '数据位于列表中；\n'
    })

  }
  else{//教练，Trainer_cur和Trainers_history中添加
    await db.collection('Trainers_cur_test').where({ openid: openid }).get().then(res => {
      if (res.data.length != 0) {
        console.log('Trainers_cur中已经添加过，')
        loglog = loglog + 'Trainers_cur中已经添加过，'
      }
      else {
        // console.log(db.collection('Status_check_test'))
        db.collection('Trainers_cur_test').add({
          data: {
            openid: openid,
            //status: dataitems.status,
            nick_name: dataitems.nick_name,
            avatarUrl: dataitems.avatarUrl
          }
        })
        loglog = loglog + 'Trainers_cur中添加成功，'
      }
    })

    await db.collection('Trainers_cur_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
      console.log('数据位于列表中；')
      loglog = loglog + '数据位于列表中；\n'
    })

    await db.collection('Trainers_history_test').where({ openid: openid }).get().then(res => {
      if (res.data.length != 0) {
        console.log('Trainers_history中已经添加过，')
        loglog = loglog + 'Trainers_history中已经添加过，'
      }
      else {
        // console.log(db.collection('Status_check_test'))
        db.collection('Trainers_history_test').add({
          data: {
            openid: openid,
            //status: dataitems.status,
            nick_name: dataitems.nick_name,
            avatarUrl: dataitems.avatarUrl
          }
        })
        loglog = loglog + 'Trainers_history中添加成功，'
      }
    })

    await db.collection('Trainers_history_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
      console.log('Trainers_history数据位于列表中；')
      loglog = loglog + 'Trainers_history数据位于列表中；\n'
    })

    

  }
  return loglog
  await db.collection('Status_check_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
    if (res.data.length != 0) {
      console.log('Status_check中已经添加过，')
      loglog = loglog + 'Status_check中已经添加过，'
    }
    else {
      // console.log(db.collection('Status_check_test'))
      db.collection('Status_check_test').add({
        data: {
          openid: openid,
          status: dataitems.status,
          nick_name: dataitems.nick_name,
          avatarUrl: dataitems.avatarUrl
        }
      })
      loglog = loglog + 'Status_check中添加成功，'
    }
  })
  await db.collection('Status_check_test').where({ status: dataitems.status }, { openid: openid }).get().then(res => {
    console.log('数据位于列表中；')
    loglog = loglog + '数据位于列表中；'
  })
  return loglog
}

var sleep = function (time) {
  var startTime = new Date().getTime() + parseInt(time, 10);
  while (new Date().getTime() < startTime) { }
}


