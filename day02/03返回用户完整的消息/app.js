//引入express
const express=require('express');
const sha1=require('sha1');

const {getUserDataAsync,parseXMLDataAsync,formatMessage} =require('./utils/tools');
//引入封装好的reply模块
const reply =require('./reply/reply');
const template =require('./reply/template');
//;建app
const app=express();
const config={
    appID:'wx4458ce39ec461257',
    appsecret:'3d2ac3680fbb40d3ad1191c086747710',
    token:'zhang11/16'
}
//创建中间件
app.use(async (req,res,next)=>{
    console.log(req.query)
    //{ signature: '540ed62265e98f445118f72ebf21cb0abd07925a',
    //   timestamp: '1542369865',
    //   nonce: '1436470202',
    //   openid: 'oStjC0lf5aceuTFFWlwbmgiemGEI' }
    //获取请求参数
    const {signature,echostr,timestamp,nonce} =req.query;
    //config配置
    const {token} =config;
    //将参数签名加密的三个参数（timestamp、nonce、token）组合在一起排序分类(sort)，将排序后的参数拼接（join）在一起，进行sha1加密
    const str=sha1([timestamp,nonce,token].sort().join(''));

    //获取get请求
    if (req.method === 'GET'){
        if (signature === str){
            res.end(echostr)
        }else {
            res.end('error')
        }
    } else if (req.method === 'POST'){
        //转发用户消息
        if (signature !== str ){
            res.end('error')
            return;
        }
        //用户发送的消息在请求体
        const xmlData=await getUserDataAsync(req);
        console.log(xmlData)
        // <xml>
        // <ToUserName><![CDATA[gh_b4efb6bb4eb8]]></ToUserName>
        // <FromUserName><![CDATA[oStjC0lf5aceuTFFWlwbmgiemGEI]]></FromUserName>
        // <CreateTime>1542373670</CreateTime>
        // <MsgType><![CDATA[text]]></MsgType>
        // <Content><![CDATA[222]]></Content>//消息具体内容
        // <MsgId>6624444471303746639</MsgId>
        // </xml>
        //将用户发送过来的xml数据解析为js对象
        const jsData =await parseXMLDataAsync(xmlData);
        console.log(jsData)

        // <xml><ToUserName><![CDATA[gh_b4efb6bb4eb8]]></ToUserName>
        // <FromUserName><![CDATA[oStjC0lf5aceuTFFWlwbmgiemGEI]]></FromUserName>
        // <CreateTime>1542377875</CreateTime>
        // <MsgType><![CDATA[text]]></MsgType>
        // <Content><![CDATA[222]]></Content>
        // <MsgId>6624462531641226327</MsgId>
        // </xml>

        //格式化数据
        const message = formatMessage(jsData);
        console.log(message);
        // { ToUserName: 'gh_b4efb6bb4eb8',
        //     FromUserName: 'oStjC0lf5aceuTFFWlwbmgiemGEI',
        //     CreateTime: '1542378796',
        //     MsgType: 'text',
        //     Content: '333',
        //     MsgId: '6624466487306105951' }


            const options =reply(message);
            const  replyMessage =template(options);
            console.log(replyMessage)
            res.send(replyMessage);
       } else {
        res.end('error')
    }
})


//监听端口号
app.listen(3000,err=>{
    if (!err) console.log('服务器启动成功');
    else console.log(err)
})