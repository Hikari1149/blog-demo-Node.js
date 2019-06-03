const express=require("express")
const router=express.Router()
const {
    getList,getDetail,newBlog,updateBlog,deleteBlog
} =require('../controller/blog')
const {SuccessModel,ErrorModel} = require ('../model/resModel.js')
const loginCheck=require('../middleware/loginCheck')

router.get('/list',(req,res,next)=>{
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        console.log("req.query ",req.query)
        if(req.query.isadmin){
            //管理员界面.
            if(req.session.username== null){
                //未登入
                res.json(
                    new ErrorModel('not log')
                )
                return
            }
            //查询自己的博客
            author=req.session.username
        }
        const result=getList(author,keyword)
        return result.then(listData=>{
            res.json(
                new SuccessModel(listData)
            )
        }).catch(err=>{
            console.log("/api/blog/list error ",err)
        })
})
router.get("/detail",(req,res,next)=>{
    const result=getDetail(req.query.id)
        return result.then(data=>{
            res.json(
                new SuccessModel(data)
            )
        })
})
router.post('/new',loginCheck,(req,res,next)=>{
    req.body.author=req.session.username 
    const result=newBlog(req.body)
    return result.then(data=>{
        res.json(
            new SuccessModel(data)
        )
    })
})
router.post('/update',loginCheck,(req,res,next)=>{
    const result=updateBlog(req.query.id,req.body)
    console.log("update result ",result)
    return result.then(val=>{
        if(val)  res.json( new SuccessModel())
        else res.json( new ErrorModel("更新博客失败"))
    })
})
router.post('/del',loginCheck,(req,res,next)=>{
    const author =req.session.username     
    const result=deleteBlog(req.query.id,author)
    return result.then(val=>{
        if(val)  res.json( new SuccessModel())
        else res.json( new ErrorModel("delete 博客失败"))
    })
})
module.exports=router