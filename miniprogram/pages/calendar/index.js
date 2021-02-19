// miniprogram/pages/calendar/index.js.js
import { jump, getCurrentYM } from '../../components/calendar/main.js'
const app = getApp()
const DB = wx.cloud.database().collection('startDate');
Page({
  //测试jump函数使用
  // doSometing() {
  //   jump(2018, 6, 6);
  // },

  /**
   * 页面的初始数据
   */
  data: {

  },

  //跳转分析结果页面
  nextStep() {
    wx.navigateTo({
      url: '../calendarRes/index'
    })
  },

  //测试jump函数
  // focusDate() {
  //   this.doSometing()
  // },

  //选择日期后的回调
  afterTapDay(e) {
    this.setData({
      year: e.detail.year,
      month: e.detail.month,
      day: e.detail.day
    })
  },
  //点击确定
  handleOk() {
    const { year, month, day } = this.data
    // console.log('7878handleOk', year, month, day)
    wx.cloud.callFunction({
      name: "getSelectDate",
      data: {
        year: year,
        month: month,
        day: day
      }
    }).then(res => {
      // console.log('5656res', res)
      const { selectDate, openid } = res.result
      //查询是否存在该条数据
      DB.doc(`${openid}`).get().then(record => {
        // console.log('7878查询', record)
        if (record) {
          //根据id更新单条数据
          DB.doc(`${openid}`).update({
            data: {
              startDate: `${selectDate}`
            }
          }).then(
            console.log('修改数据成功')
          ).catch(
            console.error
          )
        } else {
          // 插入数据
          DB.add({
            data: {
              _id: `${openid}`,
              startDate: selectDate
            }
          }).then(
            console.log('插入数据成功'),
          )
        }
      }).catch(
        console.error
      )
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
   */
  onLoad: function (options) {
    // console.log('7878onLoad', this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
    注意：对界面内容进行设置的 API 如wx.setNavigationBarTitle，请在onReady之后进行。详见生命周期
   */
  onReady: function () {
    //查询是否存在该条数据
    DB.doc(`${app.globalData.openid}`).get().then(record => {
      // console.log('7878record', record)
      //数据库中已经选择日期，则跳转到数据库中日期
      if (record) {
        const arr = record.data.startDate.split('-')
        // console.log('7878arr', arr)
        const year = Number(arr[0])
        const month = Number(arr[1])
        const day = Number(arr[2])
        jump(year, month, day);//第一次加载页面时，跳转至当前日期
        this.setData({ year, month, day })
      } else {
        //否则跳转至当前日期
        const date = new Date()
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // console.log('7878onReady', year, month, day)
        jump(year, month, day);//第一次加载页面时，跳转至当前日期
        this.setData({ year, month, day })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   * 页面显示/切入前台时触发。
   */
  onShow: function () {
    // console.log('7878onShow', this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
   */
  onHide: function () {
    // console.log('7878onHide', this)
  },

  /**
   * 生命周期函数--监听页面卸载
   * 页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。
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