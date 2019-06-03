const {login} =require('../controller/user')
const {SuccessModel,ErrorModel}=require('../modal/resModel')
const {get,set} =require('../db/redis')
//获取cookie过期时间
const getCookieExpires = ()=>{
    const d= new Date()
    d.setTime(d.getTime()+(24*60*60*1000))
    console.log("d.toGMTString() is: ",d.toGMTString())
    return d.toGMTString()
}
const handleUserRouter=(req,res)=>{
    const method=req.method
    const url=req.url
    const path=url.split("?")[0]
    if(method==='POST' && path ==='/api/user/login'){
        const {username,password} = req.body
      // const {username,password}=req.query 
       const result = login(username,password)
        return result.then(data=>{
            if(data) {
                //第一次登入成功 为session中某个对象赋值.
                req.session.username=data.username
                console.log("req.session: ",req.session)
                //同步到redis
                set(req.sessionId,req.session)
                return new SuccessModel()
            }
            return new ErrorModel("login failed")
        })
    }

    //登入验证的测试.(session中包含username 则表示已经登入.)
    if(method==='GET' && req.path === '/api/user/login-test'){
        if(req.session.username) 
            return Promise.resolve(new SuccessModel({
                username:req.session.username
            }))
        return Promise.resolve(new ErrorModel("未登入"))
    }
}
module.exports= handleUserRouter