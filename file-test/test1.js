const fs = require ('fs')
const path =require('path')


//path.resolve 路径拼接
const fileName = path.resolve(__dirname,'data.txt')

//读取文件内容
fs.readFile(fileName,(err,data)=>{
    if(err){
        console.err(err)
        return
    }
    // data 为二进制 需要转换为字符串
    console.log(data.toString())
})


//write file
const content='write something here'
const opt={
    flag:'a' //追加写入. 覆盖为w
}
fs.writeFile(fileName,content,opt,(err)=>{
    if(err){
        console.err(error)
        return
    }
})

//check file exist

fs.exists(fileName,(exist)=>{
    console.log("exist ",exist)
})
