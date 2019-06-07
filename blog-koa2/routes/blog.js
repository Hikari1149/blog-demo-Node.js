const router =require('koa-router')()
const {
    getList,getDetail,newBlog,updateBlog,deleteBlog
} =require('../controller/blog')
const {SuccessModel,ErrorModel} = require ('../model/resModel.js')
const loginCheck=require('../middleware/loginCheck')

router.prefix('/api/blog')
router.get('/list',async (ctx,next)=>{
        let author = ctx.query.author || ''
        const keyword = ctx.query.keyword || ''
        console.log("req.query ",ctx.query)
        if(ctx.query.isadmin){
            //管理员界面.
            if(ctx.session.username== null){
                //未登入
                ctx.body = new ErrorModel('not log')
                return
            }
            //查询自己的博客
            author=ctx.session.username
        }
        const listData=await getList(author,keyword)
        if(listData)  {
            ctx.body=new SuccessModel(listData)
            return
        }
        ctx.body=new ErrorModel(listData)
})
router.get("/detail",async (ctx,next)=>{
    const data=await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})
router.post('/new',loginCheck,async (ctx,next)=>{
    ctx.request.body.author=ctx.session.username 
    const data=await newBlog(ctx.request.body)
    ctx.body = new SuccessModel(data)
})
router.post('/update',loginCheck,async (ctx,next)=>{
    const val =await updateBlog(ctx.query.id,ctx.request.body)
    if(val)  ctx.body=new SuccessModel()
    else ctx.body=new ErrorModel("更新博客失败")
    
})
router.post('/del',loginCheck,async (ctx,next)=>{
    const author =ctx.session.username     
    const val =await deleteBlog(ctx.query.id,author)
 
    if(val)  ctx.body= new SuccessModel()
    else ctx.body= new ErrorModel("delete 博客失败")
    
})
module.exports=router