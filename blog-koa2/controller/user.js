const {exec,escape}=require('../db/mysql')
const {genPassword}=require('../util/cryp')
const login =async (username,password) =>{
    username=escape(username)
    password=escape(genPassword(password))
    
    const sql=`
    select username from users where username=${username} and password =${password};
    ` 
    const rows = await exec(sql)
    return rows[0]
}
module.exports={
    login
}