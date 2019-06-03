const {exec}= require('../db/mysql')
const xss=require('xss')

const getList = (author,keyword) =>{
    let sql=`select * from blogs where 1=1 `
    if(author)  sql+=`and author='${author}'`
    if(keyword) sql+=`and title like '%${keyword}%' `
    sql+='order by createtime desc'
    
    //exec 返回的是一个promise对象.
    return exec(sql)

}
const getDetail= (id) =>{
    const sql=`select * from blogs where id=${id}`
    return exec(sql).then(rows=>{
        return rows[0]
    })
}
const newBlog =(blogData={})=>{
    //blogData 博客对象 包含title,content
    const title=xss(blogData.title)
    const content=blogData.content
    const author=blogData.author
    const createTime=Date.now()
    console.log("#",title)
    const sql=`
        insert into blogs (title,content,createTime,author)
        values ('${title}','${content}',${createTime},'${author}');
    `
    return exec(sql).then(insertData=>{
        console.log(insertData)
        return{
            id:insertData.insertId
        }
    })
}
const updateBlog =(id,blogData={})=>{
    //要更新博客的id.
    //更新成功返回true
    const title=blogData.title
    const content=blogData.content

    const sql=`
        update blogs set title='${title}', content='${content}' where id=${id};    
    `
    return exec(sql).then(updateData=>{
        if(updateData.affectedRows) return true
        return false
    })
}
const deleteBlog =(id,author)=>{
    //id:需要删除的博客id.
    //传入author 为了保证只能操作自己的博客.
    const sql =`delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(delData=>{
        if(delData.affectedRows)    return true
        return false
    })
}
module.exports ={
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}