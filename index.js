// const mysql =require('mysql');

// //创建链接对象.
// const conn=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'password',
//     port:3306,
//     database:'myblog'
// })

// //开始连接.
// conn.connect()

// //执行sql语句
// const sql='select * from users'
// conn.query(sql,(err,res)=>{
//     if(err){
//         console.log(err)
//         return;
//     }    
//     console.log(res)
// })
// //关闭连接
// conn.end()

// const redis =require('redis')

// //创建客户端.
// const redisClient = redis.createClient(6379,'127.0.0.1')
// redisClient.on('error',err=>{
//     console.log(err)
// })

// //测试
// redisClient.set('myjob','web-coder',redis.print)
// redisClient.get('myjob',(err,val)=>{
//     if(err){
//         console.error(err)
//         return
//     }
//     console.log("val ",val)

//     //exit
//     redisClient.quit()
// })