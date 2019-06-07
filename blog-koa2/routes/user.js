const router= require('koa-router')()
const {login}=require('../controller/user')
const {SuccessModel,ErrorModel} =require("../model/resModel")
router.prefix('/api/user')

router.post('/login',async function(ctx,next){
    console.log("ctx :: ",ctx)
    const {username,password} = ctx.request.body
    // const {username,password}=req.query 
     const data =await login(username,password)
    if(data.username) {
              //第一次登入成功 为session中某个对象赋值.
              ctx.session.username=data.username
              console.log("req.session: ",ctx.session)
              ctx.body=new SuccessModel()
              return
            }
          ctx.body=ErrorModel("login failed")
})
router.get('/session-test',async function(ctx,next){
    if(ctx.session.viewCount == null){
        ctx.session.viewCount =0
    }
    ctx.session.viewCount ++
    ctx.body = {
        errno:0,
        viewCount:ctx.session.viewCount
    }
})

module.exports = router
