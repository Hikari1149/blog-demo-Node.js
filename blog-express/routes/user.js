const express=require('express')
const router=express.Router()
const {login}=require('../controller/user')
const {SuccessModel,ErrorModel} =require("../model/resModel")
router.post("/login",(req,res,next)=>{
    const {username,password} = req.body
    // const {username,password}=req.query 
     const result = login(username,password)
      return result.then(data=>{
          if(data) {
              //第一次登入成功 为session中某个对象赋值.
              req.session.username=data.username
              console.log("req.session: ",req.session)
            
              res.json(
                  new SuccessModel()
              )
              return
            }
          res.json(
              ErrorModel("login failed")
          )
     })
})

router.get('/login-test',(req,res,next)=>{
    if(req.session.username){
        res.json({
            errno:0,
            msg:'登入成功'
        })
        return;
    }
    res.json({
        errno:-1,
        msg:'未登入'
    })
})

router.get('/session-test',(req,res,next)=>{
    const session=req.session
    if(session.viewNum==null) {
        session.viewNum=0
    }else{
        session.viewNum++
    }
    res.json({
        viewNum:session.viewNum
    })
})
module.exports=router