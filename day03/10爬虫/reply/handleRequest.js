const sha1=require('sha1');
const {getUserDataAsync,parseXMLDataAsync,formatMessage} =require('../utils/tools');
const reply =require('./reply');
const template =require('./template');
const {token} =require('../config');
//创建中间件
module.exports =()=>{
    return async (req,res,next) =>{
        console.log(req.query)
        //获取请求参数
        const {signature,echostr,timestamp,nonce} =req.query;
        //config配置
        //const {token} =config;
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
            //将用户发送过来的xml数据解析为js对象
            const jsData =await parseXMLDataAsync(xmlData);
            //格式化数据
            const message = formatMessage(jsData);
            const options =reply(message);
            const replyMessage =template(options);
            console.log(replyMessage);
            res.send(replyMessage);
        } else {
            res.end('error')
        }
    }
}