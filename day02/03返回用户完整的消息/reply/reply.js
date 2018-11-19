//通过判断用户发送的消息类型，设置具体返回的响应
module.exports= message =>{

    //初始化配置对象
    let options = {
        toUserName:message.FromUserName,
        fromUserName:message.ToUserName,
        createTime:Date.now(),
        msgType:'text'
    }

    //初始化一个消息文本
    let content ='请说普通话~~';
    //通过判断用户发送的消息设置具体返回的内容
    if (message.MsgType === 'text'){
        //判断用户发送的内容，根据内容返回特定的响应
        if (message.Content === '1'){//全匹配
            content='你不是真的快乐';
        }else if (message.Content === '2'){
            content='像我这样的人';
        }else if (message.Content.includes('张张张')){//半匹配
            content = '张慧芳';
        }else if (message.Content === '3'){
            //回复图文信息
            options.msgType='news';
            options.title='微信公众号';
            options.description='11/18';
            options.picUrl='https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
            options.url='http://www.taobao.com';
        }
    }else  if (message.MsgType === 'voice'){
        //说明用户发送的是语音消息
        content = `语音识别结果为: ${message.Recognition}`;
    }else if (message.MsgType ==='location'){
        //用户发送位置
        content = `纬度:${message.Location_X} 经度:${message.Location_Y} 地图的缩放大小:${message.Scale} 位置详情:${message.Label}`;
    }else if (message.MsgType === 'event'){
        if (message.Event ==='subscribe' ) {
            content = '欢迎关注';
            if (message.EventKey) {
                //说明扫了带参数的二维码
                content ='欢迎您关注公众号，带参数的'
            }
        }else if (message.Event ==='unsubscribe') {
            console.log('取消关注成功')
        }else if (message.Event === 'LOCATION'){
            //用户初次访问公众号自动获取地理位置
            content=`纬度:${message.Latitude} 纬度:${message.Longitude}`;
        }else if (message.Event === 'CLICK') {
            content=`用户点击了:${message.EventKey}`;
        }
    }
    //判断用户发送的消息内容根据内容返回
    options.content=content;
    return options;
}