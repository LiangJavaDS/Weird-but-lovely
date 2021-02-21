//index.js
const app = getApp()
const DB = wx.cloud.database().collection('startDate');
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    uniqueOne: false,//控制只对一人开放，录入姨妈信息
    hideAvatar: false//控制头像的显示隐藏
  },

  hideAvatar: function () {
    // console.log('7878app', app.globalData.openid)
    if (app.globalData.openid == "oMwtS5d9s50prA1IA03aDrbw3yHk" || app.globalData.openid == "123") {
      this.setData({
        hideAvatar: true,
        uniqueOne: true
      })
    } else {
      wx.showModal({
        title: 'toolTip',
        content: '请向管理员梁凉凉申请权限!',
      })
    }
  },

  toConfig: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value),
    e.detail.value.continue == '' || e.detail.value.interval == '' ? wx.showModal({
      title: '小调皮',
      content: '宝宝,输入下数据哈',
    }) :
      wx.cloud.callFunction({
        name: "getCircleDate",
        data: {
          intervalDate: e.detail.value.interval,
          continueDate: e.detail.value.continue,
        }
      }).then(res => {
        const { openid, continueNum, intervalNum } = res.result
        //查询是否存在该条数据
        DB.doc(`${openid}`).get().then(record => {
          // console.log('7878查询', record)
          if (record) {
            //根据id更新单条数据
            DB.doc(`${openid}`).update({
              data: {
                intervalNum: intervalNum,
                continueNum: continueNum
              }
            }).then(
              console.log('修改间隔天数和持续天数成功'),
            ).catch(
              console.error
            )
          } else {
            // 插入数据
            DB.add({
              data: {
                _id: `${openid}`,
                intervalNum: intervalNum,
                continueNum: continueNum
              }
            }).then(
              console.log('插入间隔天数和持续天数成功'),
            )
          }
        }).catch(
          console.error
        )
        wx.navigateTo({
          url: '../calendar/index'
        })
      })
  },

  formSubmit: function (e) {

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  onLoad: function () {
    if (app.globalData.openid = '') {
      this.setData({
        uniqueOne: false
      })
    }
    // console.log('7878onLoad', app)
  },

  onShow: function () {
    // console.log('7878onShow', app)
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // onGetOpenid: function () {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },
})
