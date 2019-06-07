const http = require('http')
const server = http.createServer((req,res)=>{
    console.log("write something~")
    console.error("fake error")
    res.setHeader('Content-type','application/json')
    res.end(
        JSON.stringify({
            errno:0,
            msg:'hello pm2 !'
        })
    )
})

server.listen(3005)

