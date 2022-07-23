// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()


  const db = cloud.database()
  var query_status = await db.collection('Status_check_test').where({ openid: wxContext.OPENID}).get()
  var status=[]//在数据库中检查身份，1是学员，2是教练，3是店长，以status返回


  for (let i = 0; i < query_status.data.length;i++){
    status.push(query_status.data[i].status)
  }

  // if ((query_status.data[0].trainee).indexOf(wxContext.OPENID) != -1) {
  //   status.push(1)
  // }
  // if ((query_status.data[0].trainer).indexOf(wxContext.OPENID) != -1) {
  //   status.push(2)
  // }
  // if ((query_status.data[0].boss).indexOf(wxContext.OPENID) != -1) {
  //   status.push(3)
  // }
  //var boss=
  //var trainer=
  //var trainee=db.collection('status_check').get()
  //console.log(boss)

  //db.collection('status_check').get()



  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
    status: status
  }
}