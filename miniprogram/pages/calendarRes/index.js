// miniprogram/pages/calendarRes/index.js
import { jump, setTodoLabels } from '../../components/calendar/main.js'
const app = getApp()
const DB = wx.cloud.database().collection('startDate');
Page({

  /**j
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    day: 0,
    monthDays: [],
    renderCalender: [],
    loading: true
  },

  getMonthDays: function (year, month) {
    let time = new Date(year, month, 0)
    return time.getDate()
  },

  getTodoDate(year, month, day, monthDays, continueNum, intervalNum) {
    //开始日期
    // const { year, month, day, monthDays, continueNum, intervalNum } = this.data
    //先标记上次月经的日期
    let lastRenderCalender = []
    for (let i = day; i < day + continueNum; i++) {
      lastRenderCalender.push({
        year: year,
        month: month,
        day: i
      })
    }

    //开始标记下次月经的日期
    let renderCalender = lastRenderCalender
    //本月天数  
    let thisMonthDays = monthDays[month - 1]
    //下个月天数
    let nextMonthDays = monthDays[month]
    //上一次开始后本月剩余天数
    let remainDays = thisMonthDays - day

    //判断标记本月还是下月,上一次开始日期加两次间隔大于这个月剩余天数则在下个月
    if (day + intervalNum > remainDays) {
      //下次应该开始的日子
      let nextMonthStartDay = day + intervalNum - thisMonthDays + 1
      //下个月天数加上本月剩余天数大于两次间隔
      if (nextMonthDays + remainDays > intervalNum) {
        let renderMonth = month + 1
        // 标记下个月的（本月剩余天数）号
        renderCalender = this.addDataToArr(renderCalender, nextMonthStartDay, nextMonthStartDay + continueNum, year, renderMonth)
        console.log('7878renderCalender前', renderCalender)
      }
    }

    //当开始日期+间隔<本月天数，标记本月的xx号
    if (day + intervalNum < thisMonthDays) {
      // 下一次开始的日期
      let whichDay = day + intervalNum + 1
      // 下一次开始前一天
      let beforeStartDay = day + intervalNum
      //如果本月剩余天数不够标记，继续标记下个月
      if (beforeStartDay + continueNum > thisMonthDays) {
        let remainDays = thisMonthDays - beforeStartDay
        let renderMonth = month + 1
        //先标记本月剩余日期
        renderCalender = this.addDataToArr(renderCalender, whichDay, whichDay + remainDays, year, month)
        //下个月继续标记
        renderCalender = this.addDataToArr(renderCalender, 1, continueNum - remainDays + 1, year, renderMonth)
        console.log('7878renderCalender后', renderCalender)
      }
    }
    this.setData({ renderCalender, loading: false })
    return renderCalender
  },

  //参数分别为：存储需要渲染的日期，渲染的日期（几号），控制需要连续渲染几天，渲染的年份、渲染的月份
  addDataToArr: function (renderCalender, count, num, year, month) {
    // debugger
    for (; count < num; count++) {
      renderCalender.push({
        year: year,
        month: month,
        day: count
      })
    }
    return renderCalender
  },

  resetData:function(){
    wx.navigateTo({
      url: '../getformData/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    DB.doc(`${app.globalData.openid}`).get().then(record => {
      let continueNum = 0
      let intervalNum = 0
      let thisYear = 0
      // let lastYear = 0
      let month = 0
      let day = 0
      let arr = []
      if (record) {
        continueNum = record.data.continueNum
        intervalNum = record.data.intervalNum
        arr = record.data.startDate.split('-')
        thisYear = Number(arr[0])
        month = Number(arr[1])
        day = Number(arr[2])
      } else {
        //否则获取当前年份
        d = new Date()
        thisYear = d.getFullYear()
        lastYear = thisYear - 1
        month = date.getMonth() + 1;
        day = date.getDate();
      }
      //获取某年份的各月天数
      let monthDays = []
      for (let i = 0; i < 12; i++) {
        monthDays.push(this.getMonthDays(thisYear, i))
      }
      monthDays.splice(0, 1)
      monthDays.push(31)
      this.setData({ year: thisYear, month, day, monthDays, continueNum, intervalNum })
      let renderCalender = this.getTodoDate(thisYear, month, day, monthDays, continueNum, intervalNum)
      // console.log('7878renderCalender', renderCalender)
      const nowDate = new Date()
      const nowYear = nowDate.getFullYear();
      const nowMonth = nowDate.getMonth() + 1;
      const nowDay = nowDate.getDate();
      jump(nowYear, nowMonth, nowDay);
      setTodoLabels({
        // 待办点标记设置
        pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
        dotColor: '#fff', // 待办点标记颜色
        circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
        showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
        days: renderCalender
      })
    })
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

  }
})