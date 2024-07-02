//登录和注册功能
const express = require('express')
const router = express.Router()

const passport = require("passport")

//引入Profile.js
const Profile = require("../../models/Profile")

//$route  GET请求 请求路径：api/profiles/test
//@desc  返回请求的json数据
//@access  public(接口分公共的还是私有的，这里是公共的接口)
// router.get('/test', (req, res) => {
//   //返回一个json数据
//   res.json({ msg: "数据成功" });
// })


//$route  POST请求 请求路径：api/profiles/add
//@desc  创建信息接口
//@access  private(接口分公共的还是私有的)
//加了 passport.authenticate("jwt", { session: false }) 之后就是要验证token
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  const profileFields = {}
  //判断请求的各个内容是否存在,如果存在，就存入空对象中
  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.incode) profileFields.incode = req.body.incode;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  //把profileFields存入数据库
  new Profile(profileFields).save().then(profile => {
    res.json(profile);
  })
});


//获取所有信息
//$route  GET请求 请求路径：api/profiles  (在根路径下)
//@desc  获取所有信息接口
//@access  private(接口分公共的还是私有的)
router.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
  //在数据库Profile中进行查询
  Profile.find()
    .then(profile => {
      if (!profile) {//profile不存在
        return res.status(404).json("没有任何内容")
      } else {
        res.json(profile)
      }
    })
    .catch(err => {
      res.status(404).json(err)
    })
});


//获取单个信息
//$route  GET请求 请求路径：api/profiles/:id
//@desc  获取单个信息接口
//@access  private(接口分公共的还是私有的)
router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
  //在数据库Profile中进行查询
  Profile.findOne({ _id: req.params.id })
    .then(profile => {
      if (!profile) {//profile不存在
        return res.status(404).json("没有任何内容")
      } else {
        res.json(profile)
      }
    })
    .catch(err => {
      res.status(404).json(err)
    })
});

//编辑接口
//$route  POST请求 请求路径：api/profiles/edit
//@desc  编辑信息接口
//@access  private(接口分公共的还是私有的)
//加了 passport.authenticate("jwt", { session: false }) 之后就是要验证token
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const profileFields = {}
  //判断请求的各个内容是否存在,如果存在，就存入空对象中
  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.incode) profileFields.incode = req.body.incode;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  //把编辑过的信息存入数据库
  Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $set: profileFields },
    { new: true }
  ).then(profile => res.json(profile))
});

//删除信息接口
//$route  POST请求 请求路径：api/profiles/delete/:id
//@desc   删除信息接口
//@access  private(接口分公共的还是私有的)
router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
  //在数据库Profile中进行查询
  Profile.findOneAndRemove({ _id: req.params.id }).then(profile => {
    res.json(profile)
  }).catch(err => res.status(404).json('删除失败！'))
});

module.exports = router;