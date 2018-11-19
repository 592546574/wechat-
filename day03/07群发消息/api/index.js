//公共接口地址前缀
const prefix='https://api.weixin.qq.com/cgi-bin/'
//所有接口的模块
module.exports={
    accessToken:`${prefix}token?grant_type=client_credential&`,
    menu: {
       create:`${prefix}menu/create?`,
       delete:`${prefix}menu/delete?`
    },
    tag:{
        create: `${prefix}tags/create?`,
        getUsers:`${prefix}user/tag/get?`,
        batch:`${prefix}tags/members/batchtagging?`
    },
    message:{
        sendall:`${prefix}message/mass/sendall?`
    }
}