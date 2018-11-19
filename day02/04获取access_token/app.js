//引入express
const express=require('express');
const handleRequest =require('./reply/handleRequest');
//创建app
const app=express();

app.use(handleRequest());
//监听端口号
app.listen(3000,err=>{
    if (!err) console.log('服务器启动成功');
    else console.log(err)
})