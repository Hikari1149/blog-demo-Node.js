
nodejs和前端平时使用的js.都是遵循es规范的.
前者相当于es+node-api. 后者es+web-api
  
Router 管理路由.
Controller 处理数据.  
  
Postman使用.
接口
博客部分
获取博客列表 GET /api/blog/list  author='xxx'&keyword='xxx'
获取博客详情 GET /api/blog   id='xxx'
新建博客  POST /api/blog/new      title='xxx'&content='xxx'
更新博客 POST /api/blog/update   id='xxx'&title='xxx'&content='xxx'
删除博客 POST /api/blog/delete  id='xxx'
登入部分
用户登入 POST /api/user/login  username='xxx'& password='xxx'

  
数据库新建两个user和blog的表.
node-js中 require mysql库.令conn=mysql.createConnection创建连接
封装一个exec函数 用于执行sql语句. 返回一个promise对象.
  
controller 通过操作数据库返回数据给Router,
Router 拿到数据后 更新成指定的数据格式返回给app
  
日志
access.log 记录每次请求的信息(请求方式,user-agent..etc)
拆分日志的时候按时间拆分.
  
知识点
  
cookie : 存储在浏览器的一段字符串 (最大5kb)
每次发生 http 请求,都会将请求域的cookie发送给server
server可以修改cookie并返回给浏览器, 浏览器也可以通过js去修改cookie
  
登入-cookie
前端通过post请求将username,password传给server
server根据username,password通过数据库查询判断 数据是否正确.
若正确 则在response头中Set-cookie. 返回给浏览器.
接下来浏览器发送请求时都带着cookie.
server根据req中cookie的某些字段来判断状态.
  
Session
不建议在cookie中直接存储用户信息(username之类)
那么server怎么知道现在是谁登入了?
可以在cookie中存一个随机数表示userId. 然后server端中有一个session,可以根据useId映射出username.
  
实现方式:server中创建一个session(本例中时一个对象SessionData={})
第一次访问页面时,在Set-Cookie中保存一个随机数表示userId返回给客户.
登入的时候,将SessionData[userId]的某个字段标记 (SessionData[userId]=username)
每次访问页面时令req.session = SessionData[userId(just a random number)]
然后根据req.session的username属性是否为空 来判断是否登入即可.
  

Session 到 Redis
操作系统会限制一个进程的最大可用内存. (npm run dev后也是一个进程)
如果把Session直接存在node js中的某个变量中(某个进程中的内存)
显然当session过大时 node js所在的进程直接爆炸
1.session可以不用考虑断电丢失数据的问题(内存) 2.session访问频繁 3.数据量不大
解决方案Redis
  
Redis启动
打开一个 cmd 窗口 使用 cd 命令切换目录到 C:\redis 运行：
redis-server.exe redis.windows.conf
切换到 redis 目录下运行:
redis-cli.exe -h 127.0.0.1 -p 6379
  
nginx 反向代理
  
反向代理:客户端不同的请求代理到不同的服务器上.(客户端不知道是哪一个服务器返回请求)
正向代理:客户端选择一个代理服务器取发送请求. (服务端不知道是哪一个客户端发送请求)
  
在8000端口下启动nginx服务器.现在浏览器访问的是8080端口
在nginx配置文件中,设置location的代理. (nginx将请求转给某个服务器再转发给客户端)
当访问/api接口时 实际上访问的是3000端口(本例 node js启动的端口)
当访问/接口时.实际上访问的是8001端口(静态文件,http-server启动的端口)

  
http-server
构建一个本地服务器,运行静态的html文件

安全部分
  
sql注入 
把SQL命令插入到Web表单提交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的SQL命令.
举例:
用户登入时输入账号和密码,server端(controller)拿到username,password在数据库中查询是否有该用户信息 select username from uses where username='${xxx}' and password='${xxx}' 若查询到匹配用户 则登入成功.
如果此时接受到的username是 xxx'--  由于sql语法中-- 为注释,那么密码部分被注释 查询返回的结果为该用户信息. 
解决方案:碰到'等特殊字符时 加上转义字符.
  
xss攻击
在页面展示内容中掺杂js代码,以获取网页信息
举例(存储式xss)
新建博客内容中包含js代码(例如通过document.cookie获取cookie,然后把该cookie发送到自己的服务器中.)
用户A写一篇博客其内容带有js代码.那么用户B访问时,浏览器执行js代码,暴露用户B的cookie给用户A.
解决方案:碰到<>使用转义字符
  
数据库密码加密
后端得到用户密码后 经过加密 在写入数据库.
即使数据库中用户密码被hack,得到的只是加密过的密码.
  

Express
  
app.js 
生成一个express app实例,定义日志,解析json格式数据,post中的数据,cookie
注册路由,处理后返回信息.
app.use用来注册中间件.
遇到http请求,根据path和method判断触发那些.
  
Middleware
Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
  
Middleware functions can perform the following tasks:  
Execute any code.  
Make changes to the request and the response objects.  
End the request-response cycle.  
Call the next middleware in the stack.  

