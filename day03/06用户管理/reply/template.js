//设置最终xml消息给微信服务器
//返回xml消息给微信服务器
module.exports = options =>{
    let replyMessage =`<xml>
       <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
       <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
       <CreateTime>${options.createTime}</CreateTime>
       <MsgType><![CDATA[options.msgType]]></MsgType>`;
    if (options.msgType === 'text'){
        replyMessage +=`<Content><![CDATA[${options.content}]]></Content>`;
    }else if (msgType === 'image'){
        replyMessage +=`<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`;
    }else if(options.msgType === 'voice'){
        replyMessage +=`<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
    }else if (options.msgType === 'video') {
        replyMessage += `<Video>
        <MediaId><![CDATA[media_id]]></MediaId>
        <Title><![CDATA[title]]></Title>
        <Description><![CDATA[description]]></Description>
        </Video>`
    }


    replyMessage +=`</xml>`;
    return replyMessage
}