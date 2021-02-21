const app = getApp()
let saveGlobalData = function(_this,item1,item2,item3){
  console.log('9898成功引用')
  _this.setData({item1,item2,item3})
  // getLocalInfo(_this)
}