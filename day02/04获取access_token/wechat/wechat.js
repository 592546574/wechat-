const rp = require('request-promise-native');
const {writeFile,readFile}=require('fs');
const {appID,appsecret}=require('../config');
//获取定义请求地址https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
class Wechat{
    async getAccessToken(){
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        //发送请求
        const result=await rp({method:'GET',url,json:true})
        //设置access过期时间
        result.expires_in=Date.now() + 7200000 -300000
        //返回result
        return result;
    }
    //保存access数据
    saveAccessTok (filePath,accessToken){
        return new Promise((resolve,reject)=>{
            //转换成json
            writeFile(filePath,JSON.stringify(accessToken),err=>{
                if (!err){
                    resolve();
                } else {
                    reject('saveAccessTok:'+err)
                }
            })
        })
    }
    //读取access数据
    readAccessToken(filePath){
        return new Promise((resolve,reject)=>{
            readFile(filePath,(err,data)=>{
                if (!err){
                    //先调用toString转成字符串。再用json。parse解析为js对象
                    resolve(JSON.parse(data.toString()));
                }else {
                    reject('readAccessToken方法出问题:'+err);
                }
            })
        })
    }
    isValidAccessToken({expires_in}){
        if (Date.now()>=expires_in){
          //说明时间过期
          return false
        }else {
            return true
        }
    }
    //封装
    fetchAccessToken(){
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)){
            console.log('进来了');
            //说明access_token是有效的
            return Promise.resolve({access_token:this.access_token,expires_in:this.expires_in})
        }
        //最终目的返回有效access
        return this.readAccessToken('./accessToken.txt')
            .then(async res =>{
                if (this.isValidAccessToken(res)){
                    //没有过期
                    return res;
                }else {
                    //过期了
                    const accessToken =await this.getAccessToken();
                    await this.saveAccessTok('./accessToken.txt',accessToken)
                    return accessToken;
                }
            })
            .catch(async err=>{
                const accessToken =await w.getAccessToken();
                await w.saveAccessTok('./accessToken.txt',accessToken);
                return accessToken;
            })
            .then(res=>{
                this.access_token=res.access_token;
                this.expires_in=res.expires_in;
                return Promise.resolve(res);
            })
    }
}
(async ()=>{
   //读取本地保存access_token（readAccessToken）判断是否过期（isValidAccessToken）
    //过期了, 重新发送请求，获取access_token（getAccessToken），保存下来（覆盖之前的）(saveAccessToken)
    const w=new Wechat();
    let result=await w.fetchAccessToken();
    console.log(result)
    result =await w.fetchAccessToken()
    console.log(result)
})()