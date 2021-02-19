// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { intervalDate, continueDate } = event
  let intervalArr = intervalDate.split('')
  let continueArr = continueDate.split('')
  intervalArr.splice(intervalArr.length - 1, 1)
  continueArr.splice(continueArr.length - 1, 1)
  let intervalNum = ''
  let continueNum = ''
  intervalArr.forEach(item => {
    intervalNum += item
  })
  continueArr.forEach(item => {
    continueNum += item
  })
  intervalNum = Number(intervalNum)
  continueNum = Number(continueNum)
  return {
    intervalNum,
    continueNum,
    event,
    openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}