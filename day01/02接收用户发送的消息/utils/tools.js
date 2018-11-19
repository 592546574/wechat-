const {parseString}=require('xml2js');
//暴露出去一个对象
module.exports={
    //用户发送的消息在请求体
    getUserDataAsync(req){
       return new Promise(resolve => {
           let result='';
           req
               .on('data',data=>{
               //转换字符串
               result += data.toString();
           })
               .on('end',()=>{
                   console.log('用户数据接收完毕');
                   resolve(result)
               })
       })
    },
    //将用户发送过来的xml数据解析为js对象
    parseXMLDataAsync(xmlData){
        return new Promise((resolve,reject)=>{
            parseString(xmlData,{trim:true},(err,data)=>{
                if(!err){
                    resolve(data)
                }else {
                    reject('parseXMLDataAsync方法:'+err)
                }
            })
        })
    },
    //格式化数据({})去掉xml和[]
    formatMessage({xml}){
        let result={};
        //遍历对象
        for (let key in xml) {
           //获取属性值
           let value=xml[key];
           //去掉[]
            result[key]=value[0]
        }
        return result;
    }
}