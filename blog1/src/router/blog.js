const {
    getList,getDetail,newBlog,updateBlog,deleteBlog
} =require('../controller/blog')
const {SuccessModel,ErrorModel} = require ('../modal/resModel')

//统一的登录验证函数
const loginCheck = (req) =>{
    if(!req.session.username){
        return Promise.resolve(new ErrorModel("未登入"))
    }
}


const handleBlogRouter=(req,res)=>{
    const method=req.method;
    const url=req.url;
    const path=url.split("?")[0]
    const id=req.query.id
    const loginCheckResult=loginCheck(req)
    //获取博客列表.
    if(method==='GET' && path==='/api/blog/list'){
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        if(req.query.isAdmin){
            //管理员界面.
            const loginCheckResult=loginCheck(req)
            if(loginCheckResult){
                //未登入
                return loginCheckResult
            }
            author=req.session.username
        }
        const res=getList(author,keyword)
        return res.then(listData=>{
            return new SuccessModel(listData)
        })
    }
    //获取博客详情.
    if(method==='GET'&& path==='/api/blog/detail'){
        const result=getDetail(id)
        return result.then(data=>{
            return new SuccessModel(data)
        })
        
    }
    //新建博客
    if(method==='POST' && path==='/api/blog/new'){
        if(loginCheckResult){
            //未登入
            return loginCheckResult
        }
        req.body.author=req.session.username 
        const result=newBlog(req.body)
        return result.then(data=>{
            return new SuccessModel(data)
        })
    }
    //更新博客
    if(method==='POST' && path==='/api/blog/update'){
        if(loginCheckResult){
            //未登入
            return loginCheckResult
        }
        const result=updateBlog(id,req.body)
        console.log("update result ",result)
        return result.then(val=>{
            if(val)  return new SuccessModel()
            else return new ErrorModel("更新博客失败")
        })
    }
    //删除博客
    if(method==='POST' && path==='/api/blog/del'){
        if(loginCheckResult){
            //未登入
            return loginCheckResult
        }
       const author =req.session.username     
       const result=deleteBlog(req.query.id,author)
       return result.then(res=>{
        if(res)   return new SuccessModel()
        else return new ErrorModel("删除博客失败")
       })
    }
}
module.exports=handleBlogRouter