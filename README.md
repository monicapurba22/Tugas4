# 第一天

###### 文件配置

```
|----------config文件夹
	|----------keys.js连接数据库的url
	|----------passport.js
|----------server.js项目主入口文件
|----------routes路由文件夹(里面放要访问的接口地址)
	|----------api文件夹
		|----------users.js登录和注册接口
		|----------profiles.js创建信息和获取所有信息和获取单个信息接口和编辑信息接口和删除信息接口
|----------models创建数据库模型
	|----------User.js用户信息的数据库模型
	|----------Profile.js数据信息的数据库模型
```

```
users.js
	先引入express，然后实例化router
        const express = require('express')
        const router = express.Router()
       	router.get/post()//在这里面配置路由，看是get请求还是post请求
    在server.js中引入路由
    	const users = require("./routes/api/users")
    使用中间件来使用routes
    	app.use('/api/users', users)
    	
写注册功能时因为是POST请求，所以要npm install body-parser
然后在server.js中引入body-parser
使用中间件
		app.use(bodyParser.urlencoded({extended:false}))
		app.use(bodyParser.json())
		
要从数据库中获取所有用户然后查询其邮箱是否重复，所以要引入User.js 
npm install bcrypt 对密码进行加密

使用头像avatar用到第三方包 npm install gravatar
在new User之前创建avatar
	        const avatar = gravatar.url(req.body.email,{s:"200",r:'pg',d:'mm'})
//如果没有设置头像，系统会设置一个默认头像

登录功能：jwt: json web token
	1、npm install jsonwebtoken
	2、获取到req中的email和password，查看数据库中是否存在email，存在的话匹配password
	3、在user.js中引入jwt	
		const jwt = require('jsonwebtoken')
	4、在进行密码匹配里定义规则并使用
		jwt.sign("规则","加密名字","过期时间","箭头函数")
	5、在keys.js中设置secretOrKey项，然后在users.js文件中引用
	
	6、使用passport-jwt验证token
		1.npm install passport-jwt passport
		2.在server.js中引入passport并初始化
			const passport = require('passport')
			app.use(passport.initialize())
		3.创建passport.js，在里面编写规则
		4.在user.js中验证token
			router.get("/current", passport.authenticate("jwt", { 				session: false }), (req, res) => {
              // res.json(req.user)//验证成功token后返回用户所有信息
              res.json({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
              })//验证成功token后返回用户指定的信息
            })
```

```
User.js
	创建数据库模型（规则）
```

# 第二天

###### token

```
为了获取数据的一个令牌，只有拿到令牌之后才能拿到想要请求的数据

在postman中设置Headers
	key:Authorization
	value:之前返回的token值
	
	如果规则中要用到token就必须这样设置，然后才可以在Body中发出请求，接收响应
```

###### 添加一个选择身份的字段

```
在User.js里多增加一个字段identity，来判断是管理员还是普通用户
在users.js里new User的时候增加identity，登录的时候多定制identity的规则，匹配token成功后也返回identity
```

###### 数据信息接口

```
创建数据模型 models/Profile.js，在server.js中引入并使用，编写对应的api接口
该文件中有三个接口，分别是：创建信息、获取所有信息、获取单个信息、编辑信息、删除信息

其中，获取单个信息需要前端发来id作为匹配依据

删除信息接口用的是router.delete()
```

##### 前端

```
vue create client
```

###### 前后端连载

```
npm install concurrently
。。。
```

###### 页面文件配置

```
|--------------public文件夹
	|--------------css文件夹
        |--------------reset.css（把各种边距设为0）
	|--------------index.html
|--------------src文件夹
    |--------------assets静态资源文件夹
    |--------------components组件文件夹
    	|--------------Dialog.vue添加按钮弹窗组件
    	|--------------HeadNav.vue头部导航组件
    	|--------------Left.vue侧边栏组件
    |--------------pages路由组件文件夹
        |--------------Index.vue首页路由组件
        |--------------404.vue404路由组件
        |--------------Login.vue登录路由组件
        |--------------Register.vue注册路由组件
        |--------------Home.vue首页路由组件
        |--------------FundList.vue资金数据展示路由组件
        |--------------Infoshow.vue用户信息展示路由组件
    |--------------router路由配置文件夹（配置路由）
        |--------------index.js
    |--------------store vuex文件夹
        |--------------index.js
    |--------------App.vue
    |--------------main.js
    |--------------http.js请求拦截和响应拦截文件
```

```
npm install element-ui
在main.js中进行配置
```

```
路由组件Index.vue
路由组件Register.vue
路由组件404.vue
	    {
        path: '*',//什么都没有访问到
        name: "/404",
        component: NotFound
        },
```

# 第三天

```
在Register.vue中使用element-ui
	看文档
	编写data
		在data里可以编写表单的规则，实现ajax
```

###### http.js

```
负责请求拦截和响应拦截
npm install --save axios
在main.js中引入
	import axios from './http';
	Vue.prototype.$axios;
看element-ui文档，写开始动画和结束动画
写请求拦截和响应拦截
```

###### vue.config.js

```
解决跨域请求
```

```
登录页面	
	路由组件Login.vue
	在methods里通过axios发请求
		返回的res中有token
		登录成功之后通过解构的方式拿到token，并存储到localstorage里，最后进行路由跳转
```

###### 路由守卫和token过期处理

```
在登录之前智能访问登录和注册页面，访问index页面会跳转到登录页面
	路由守卫的功能在router/index.js里写
	前置路由守卫：router.beforeEach((to,from,next)=>{})
做完路由守卫后去完善请求拦截和响应拦截，因为在登录之后要将token作为请求头，在响应拦截的地方判断token是否过期
	在请求拦截中判断token是否存在，如果存在设置统一的请求头
	在响应拦截中获取错误状态码，如果状态码==401，则说明token已经失效，就要清除localstorage中的eleToken，并重新跳转到登录页面
```

###### 解析token并将其存储到vuex中

```
解析token	
	npm install --save jwt-decode(在client路径下)
	在Login.vue中使用
		import jwt_decode from 'jwt-decode';
		在submitForm方法中解析token
存储到vuex
	npm install --save vuex
	在store/index.js里配置  state,mutations,getters,actions
在Login.vue中,把token存储到vuex中
	this.$store.dispatch()

会有以刷新就丢失vuex数据的情况，所以把Login.vue中的methods复制到App.vue，重新进行配置：
	判断localStorage.eleToken是否存在，存在的话就进行解码，存到vuex中
```

###### 设计顶部导航

```
components/HeadNav.vue
引入到Index.vue

下拉菜单
	引入element-ui
	看文档
	写methods
	配置两个actions
	在HeadNav组件的methods中调用编写的两个actions方法
```

```
设置首页和个人信息
pages/Home.vue
是Index.vue下的二级路由
	所以不能在Index.vue中使用<Home/>，得用<router-view></router-view>

个人信息组件
pages/Infoshow.vue
需要获取用户信息，并展示用户名和身份
	  computed: {
        user() {
          return this.$store.getters.user;
        },
      },
```

```
添加左侧导航栏
components/Left.vue
在pages/Index.vue中引入
```

###### 资金管理

```
创建组件
pages/FundList.vue
发送请求，拿到数据（对应后端接口/api/profiles中的数据）
配置当前路由
使用element-ui
```

# 第四天

###### 资金管理

```
给编辑和删除按钮添加点击事件和对应方法
```

###### 添加按钮

```
添加功能
在资金管理组件里设置添加按钮 FundList.vue
给按钮添加点击事件handleAdd
点击按钮有弹框，用到element-ui Dialog组件

弹框新建一个组件
components/Dialog.vue
	其中属性:visible.sync="dialog.show"中的dialog.show的值希望从FundList组件中传递过来，所以
		在Dialog.vue组件中用props接收dialog
		在FundeList.vue组件中引入Dialog.vue组件，并注册组件，然后使用：<Dialog/>
		在data中定义dialog（因为要传dialog）
		在点击事件handleAdd中把dialog.show改成true，即显示弹窗
		给<Dialog/>动态绑定dialog，即<Dialog :dialog="dialog" />
```

###### 完成添加功能

```
使用element-ui
配置data，使用数组和对象，方便在模板中遍历数据
在data里写输入框的校验规则
给提交按钮添加点击事件onSubmit，并将表单中的值传入方法中，在methods中写方法
	在onSubmit中接收传递过来的form，并且做完验证之后把数据传递到接口去，如果添加成功就返回一条提示信息，并关闭弹窗
关闭弹窗之后注册一个事件 this.$emit('udate');  事件注册之后让父级组件FundList.vue来执行
	<Dialog :dialog="dialog" @update="getprofile/>
	（getprofile是FundList组件里的方法，用于获取表格数据）
```

###### 编辑和删除功能

```
编辑和添加写在一个组件里，只是需要辨别点击的是编辑按钮还是添加按钮，如果是编辑按钮，就把数据放在表单中展示；如果是添加按钮，则表单内容为空。
	把Dialog.vue组件中data的formData数据剪切到父级组件中，然后将formData里的数据再传入到Dialog.vue组件中	:formData="formData"
	在Dialog.vue组件props接收formData
	在FundList.vue组件的data中的dialog里新增两个属性title和option（Dialog.vue组件中已经接收了dialog）
	在FundList.vue组件中编写修改方法handleEdit，修改dialog里属性的值，点击修改按钮之后可以弹窗；获取当前行的formData
		this.formData = {
            type: row.type,
            describe: row.describe,
            incode: row.incode,
            expend: row.expend,
            cash: row.cash,
            remark: row.remark,
            id: row._id,
          };
     修改handleAdd方法，操作与上一步相同
     在Dialog.vue组件的onSubmit方法中判断点击的是添加按钮还是编辑按钮，利用dialog的option属性进行判断（修改操作需要传入formData的id）
 	 const url = this.url.option==="add"?"add":`edit/${this.formData.id}`


删除功能，在FundList.vue组件里写方法
	    handleDelete(index, row) {
         this.$axios.delete(`/api/profiles/delete/${row._id}`).then((res) => {
         this.message("删除成功！");
         this.getProfile();
         });
         },
```

# 第五天

###### 实现分页结构

```
用到element-ui的pagination分页组件
在FundList.vue组件里编写
	在data中添加paginations的一个对象
	把paginations里的属性动态绑定到标签页里
	修改getProfile(){}
	给<el-pagination>添加方法handleCurrentChange(){}和handleSizeChange(){}和setPaginations(){}
```

###### 筛选功能

```
用到element-ui的DateTimePicker日期时间选择器组件
在FundList.vue组件里编写
在data添加search_data对象
在模板标签中绑定属性
修改getProfile(){}
	this.filterTableData = res.data;
写handleSearch(){}
```

###### 权限功能

```
普通员工不能使用添加、删除、修改功能
在computed中获取到user（从vuex中获取）
	    user(){
          return this.$store.getters.user
        }
在模板中的按钮标签里写  v-if="user.identity=='manage'" ，即只有管理员才能显示三个操作按钮
```

