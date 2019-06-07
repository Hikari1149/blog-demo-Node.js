const {exec}= require('../db/mysql')
const xss=require('xss')

const getList = async (author,keyword) =>{
    let sql=`select * from blogs where 1=1 `
    if(author)  sql+=`and author='${author}'`
    if(keyword) sql+=`and title like '%${keyword}%' `
    sql+='order by createtime desc'
    
    //exec 返回的是一个promise对象.
    return await exec(sql)

}
const getDetail= async (id) =>{
    const sql=`select * from blogs where id=${id}`
    const rows=await exec(sql)
    return rows[0]
}
const newBlog =async (blogData={})=>{
    //blogData 博客对象 包含title,content
    const title=xss(blogData.title)
    const content=blogData.content
    const author=blogData.author
    const createTime=Date.now()
    const sql=`
        insert into blogs (title,content,createTime,author)
        values ('${title}','${content}',${createTime},'${author}');
    `
    const insertData=await exec(sql)
    return {
        id:insertData.insertId
    }
}
const updateBlog =async (id,blogData={})=>{
    //要更新博客的id.
    //更新成功返回true
    const title=blogData.title
    const content=blogData.content

    const sql=`
        update blogs set title='${title}', content='${content}' where id=${id};    
    `
    const updateData = await exec(sql)
    if(updateData.affectedRows) return true
    return false
}
const deleteBlog =async (id,author)=>{
    //id:需要删除的博客id.
    //传入author 为了保证只能操作自己的博客.
    const sql =`delete from blogs where id=${id} and author='${author}'`
    const delData = await exec(sql)
    if(delData.affectedRows)    return true
    return false
}
module.exports ={
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}