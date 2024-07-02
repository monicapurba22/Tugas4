const mongoose = require('mongoose')
const Schema = mongoose.Schema

//创建Schema
const ProfileSchema = new Schema({
  //创建规则
  type: {
    type: String,
  },
  describe: {//描述
    type: String,
  },
  incode: {//收入
    type: String,
    required: true
  },
  expend: {//支出
    type: String,
    required: true
  },
  cash: {//现金
    type: String,
    required: true
  },
  remark: {//备注
    type: String,
  },
  date: {//日期
    type: Date,
    default: Date.now
  },
})

module.exports = Profile = mongoose.model('profiles', ProfileSchema)