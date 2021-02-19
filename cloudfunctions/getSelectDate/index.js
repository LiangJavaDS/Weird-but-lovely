// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// const DB = wx.cloud.database().collection('startDate');
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const selectDate = event.year + '-' + event.month + '-' + event.day

  return {
    selectDate,
    event,
    openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}