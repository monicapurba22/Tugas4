const mongoose = require('mongoose')
const Schema = mongoose.Schema

//创建Schema
const UserSchema = new Schema({
  //创建规则
  name: {//名字
    type: String,
    required: true
  },
  email: {//邮箱
    type: String,
    required: true
  },
  password: {//密码
    type: String,
    required: true
  },
  avatar: {//头像
    type: String
  },
  date: {//日期
    type: Date,
    default: Date.now
  },
  identity: {//身份
    type: String,
    required: true
  },
})

module.exports = User = mongoose.model('users', UserSchema)