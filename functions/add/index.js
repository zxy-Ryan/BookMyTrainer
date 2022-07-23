// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  var db = cloud.database()
  const _ = db.command
  //var res
  // for(let i=0;i<100;i++){
  //   await db.collection('Trainers_cur_test').add({
  //     data: {
  //       openid: String(Math.floor(Math.random() * 10000000)),
  //       //status: String(Math.floor(Math.random() * 10)),
  //       nick_name: String(Math.floor(Math.random() * 10000)),
  //       avatarUrl: String(Math.floor(Math.random() * 10000000000000000))
  //     }
  //   })

  // }




  openid1 = String(Math.floor(Math.random() * 10000000));
  openid2 = String(Math.floor(Math.random() * 10000000));
  openid3 = String(Math.floor(Math.random() * 10000000));

  for (let i=0;i<1000;i++){
    if(i%3==0){
      await db.collection('reser_model').add({
        data: {
          openid: openid1,
          number:1,
          kk: Math.random() * 1000
        }
      })
    }
    if (i % 3 == 1) {
      await db.collection('reser_model').add({
        data: {
          openid: openid2,
          number: 2,
          kk: Math.random() * 1000
        }
      })
    }
    if (i % 3 == 2) {
      await db.collection('reser_model').add({
        data: {
          openid: openid3,
          number: 3,
          kk: Math.random() * 1000
        }
      })
    }
  }


  // const MAX_LIMIT = 10
  // var db = cloud.database()
  // const countResult = await db.collection('reser_model').count()
  // const total = countResult.total
  // const batchTimes = Math.ceil(total / 10)
  // const tasks = []
  // for (let i = 0; i < batchTimes; i++) {
  //   const promise = db.collection('reser_model').where({ openid: "9643310" }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  //   tasks.push(promise)
  // }
  // // data_list = (await Promise.all(tasks)).reduce((acc,cur).then(res=>{}))
  // return (
  //   await Promise.all(tasks)).reduce((acc, cur) => ({
  //     data: acc.data.concat(cur.data),
  //     errMsg: acc.errMsg,
  //   }))
}