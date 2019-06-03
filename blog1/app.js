const querystring=require('querystring')
const handleBlogRouter= require('./src/router/blog')
const handleUserRouter=require('./src/router/user')
const {get,set} =require('./src/db/redis')
const {access} = require('./src/util/log')
// session 数据.
// const SESSION_DATA={}
const getPostData = (req) =>{
    const promise =new Promise((resovle,reject)=>{
        console.log("in1")
        if(req.method!=='POST'){
            console.log("in2")
            resovle({})
            return
        }
        if(req.headers['content-type']!=='application/json'){
            resovle({})
            return
        }
    
        let postData=''
        req.on('data',chunk=>{
            postData+=chunk.toString()
        })
        req.on('end',()=>{
            if(!postData){
                resovle({})
                return
            }
            resovle(
                JSON.parse(postData)
            )
        })
    })
    console.log("in3")
    return promise
}
const serverHandle= (req,res)=>{
   access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    res.setHeader('Content-type','application/json')
    //获取path
    const url =req.url
    req.path= url.split('?')[0]
    //解析query
    req.query =querystring.parse(url.split('?')[1])
    //解析cookie
    req.cookie ={}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2
    cookieStr.split(',').forEach(item=>{
        if(!item)   return  
        const arr= item.split('=')
        const key=arr[0].trim()
        const val=arr[1].trim()
        req.cookie[key]=val
    })

    //解析session 使用Redis
    let needSetCookie=false
    let userId=req.cookie.userid
    if(!userId){
        needSetCookie=true
        userId=`${Date.now()}_${Math.random()}`
        set(userId,{})
    }
    //获取session
    req.sessionId=userId
    get(req.sessionId).then(sessionData=>{
        if(sessionData==null){
            //初始化redis 中的 ression值
            set(req.sessionId,{})
            req.session={}
        }else{
            req.session=sessionData
        }
        //处理 postData
        return getPostData(req)
    })
    .then(postData=>{
        req.body=postData
         //处理Blog路由
        const blogResult=handleBlogRouter(req,res)
        if(blogResult){
            blogResult.then(blogData=>{
                if(needSetCookie)
                    res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly`)
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        const userResult =handleUserRouter(req,res)
        if(userResult){
            userResult.then(userData=>{
                if(needSetCookie)
                     res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly`)
                res.end(
                    JSON.stringify(userData)
                )
            })
            return;
        }
        //未命中路由. 返回404
        res.writeHead(404,{'Content-type':'text/plain'})
        res.write('404 not found\n')
        res.end()
    }).catch(err=>{
        console.log("err ",err)
    })
}
module.exports=serverHandle