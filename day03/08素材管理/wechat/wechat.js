const rp = require('request-promise-native');
const {writeFile,readFile,createReadStream}=require('fs');
const {appID,appsecret}=require('../config');
const api=require('../api');

//获取定义请求地址https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
class Wechat{
    async getAccessToken(){
        const url = `${api.accessToken}appid=${appID}&secret=${appsecret}`;
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
    //判断access是否过期
    isValidAccessToken({expires_in}){
        if (Date.now()>=expires_in){
          //说明时间过期
          return false
        }else {
            return true
        }
    }
    //封装返回access的方法
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
                    await this.saveAccessTok('./accessToken.txt',accessToken);
                    return accessToken;
                }
            })
            .catch(async err=>{
                const accessToken =await this.getAccessToken();
                await this.saveAccessTok('./accessToken.txt',accessToken);
                return accessToken;
            })
            .then(res=>{
                this.access_token=res.access_token;
                this.expires_in=res.expires_in;
                return Promise.resolve(res);
            })
    }

    async createMenu(menu){
        try{
            //获取access
            const {access_token} =await this.fetchAccessToken()
            //定义请求地址
            const url =` ${api.menu.create}access_token=${access_token}`;
            //发送请求
            const result =await rp({method: 'POST',url,json:true,body:menu});
            return result;
        }catch (e) {
            return `createMenu方法处理问题`+e;
        }
    }
    //删除菜单
    async deleteMenu(){
        try {
            //获取access
            const {access_token}=await this.fetchAccessToken();
            //定义请求地址
            const url=`${api.menu.delete}access_token=${access_token}`;
            //发送请求
            const result=await rp({method:'GET',url,json:true});
            return result;
        }catch (e) {
            return `deleteMenu方法出问题:`+e;
        }
    }

    //用户标签管理。创建标签
    async createTag(name){
        try {
            //获取access
            const {access_token}=await this.fetchAccessToken();
            //定义请求地址
            const url=`${api.tag.create}access_token=${access_token}`;
            //发送请求
            const result =await rp({method:'POST',url,json:true,body:{tag:{name}}});
            return result;
        }catch (e) {
            return 'createTag方法出问题:'+e;
        }
    }
    //获取标签下粉丝列表
    async getTagUsers(tagid, next_openid ='') {
       try {
           //获取
           const {access_token}=await this.fetchAccessToken();
           //定义请求地址
           const url =`${api.tag.getUsers}access_token=${access_token}`;
           //发送请求
           const result=await rp({method:'POST',url,json:true,body:{next_openid,tagid}});
           return result;
       }catch (e) {
           return`getTagUsers处理出现问题:` + e;
       }
    }
    //给用户打标签
    async batchUsersTag(openid_list, tagid){
      try {
         const {access_token}=await this.fetchAccessToken();
         const url =`${api.tag.batch}access_token=${access_token}`;
         const result=await rp({method:'POST',url,json:true,body:{tagid, openid_list}})
     } catch (e) {
         return`batchUserTag处理出现问题` + e;
     }
  }
  //群发消息
    async sendAllByTag(options){
        try {
            const {access_token} = await this.fetchAccessToken();
            const url = `${api.message.sendall}access_token=${access_token}`;
            return await rp({method:'POST',url,json:true,body:options});
        }catch (e) {
            return 'sendAllByTag方法出了问题' + e;
        }
    }
    //永久素材
    async uploadMaterial(type, material, body){
        try {
            const {access_token} =await this.fetchAccessToken();
            let url='';
            let options ={method:'POST',json:true}
            if (type === 'news'){
                url =`${api.upload.addNews}access_token=${access_token}`;
                //请求参数
                options.body = material;
            }else if (type === 'pic'){
                url = `${api.upload.uploading}access_token=${access_token}`;
                //以form表单上传
                options.formData ={
                    media: createReadStream(material)
                }
            } else {
                url =`${api.upload.uploadOthers}access_token=${access_token}`;
                //以form表单上传
                options.formData ={
                    media: createReadStream(material)
                }
                if (type === 'video'){
                    options.body =body;
                }
            }
            options.url =url;
            //发送请求
           return await rp(options);
        }catch (e) {
            return 'uploadMaterial方法出了问题' + e;
        }
    }
}
(async ()=>{
    const w =new Wechat();
   //  // msg_id: 1000000001 }let result1 = await w.createTag('zhangzhang');//{ tag: { id: 101, name: 'zhangzhang' } }
   //  //上传图片获取media-id
   //  let result1 =await w.uploadMaterial('image','./bg.jpg')
   //  console.log(result1)
   //  //{ media_id: 'jDoJzHD2yfW5YxecAG9d8ijhBvCQBlynVP3QWXXAMe0',
   //  //上传图片获取地址
   //  let result2 =await w.uploadMaterial('pic','./01.jpg');
   //  console.log(result2);
   //  //url: 'http://mmbiz.qpic.cn/mmbiz_jpg/YCtxHJGQT9LsG6CRlOxicssBJcmExcoaqQc3JYaTbJkZkRrQEuF3UozXQXy3cZVX0Q3kd5OeqyQDKibciaiaThyiaMA/0?wx_fmt=jpeg' }
   //  // 进来了
   //  //上传图文消息
   //  let result3 = await w.uploadMaterial('news',{
   //      "articles": [{
   //      "title": 微信号开发,
   //      "thumb_media_id": result1.media_id,
   //      "author": '名',
   //      "digest":'11/19开发',
   //      "show_cover_pic": ( 1),
   //      "content": `<!DOCTYPE html>
   //                   <html lang="en">
   //                   <head>
   //                          <meta charset="UTF-8">
   //                          <title>Title</title>
   //                    </head>
   //                    <body>
   //                      <h1>微信公众号开发</h1>
   //                      <img src="${result2.url}">
   //                    </body>
   //                    </html>`,
   //      "content_source_url": 'http://www.taobao.com',
   //      "need_open_comment":1,
   //      "only_fans_can_comment":1
   //      },
   //          {
   //              "title": 'class0810',
   //              "thumb_media_id": result1.media_id,
   //              "author": '佚名',
   //              "digest": '课程学了一大半了~马上要毕业了',
   //              "show_cover_pic": 0,
   //              "content": '今天天气真晴朗',
   //              "content_source_url": 'https://www.baidu.com',
   //              "need_open_comment":0,
   //              "only_fans_can_comment":0
   //          }
   //      ]
   //  });
   // console.log(result3)

    //删除菜单，在重新创建
    let result =await w.deleteMenu();
    console.log(result);
    result = await w.createMenu(requise(`./menu`));
    console.log(result)
})()