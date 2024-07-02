const mongoose = require("mongoose");//需要用到models里面的User.js，所以引入
const User = mongoose.model("users");//users的数据库
const keys = require("../config/keys");

//需要查看passport-jwt的文档说明
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//验证对应token
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {//如果用户存在
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
      .catch(err => console.log(err))
  }));
}