//菜单配置模块
module.exports={
    "button":[
        {
            "type":"click",
            "name":"今日歌曲",
            "key":"我们的歌"
        },
        {
            "name": "二级菜单",
            "sub_button": [
                {
                    "type": "view",
                    "name": "跳转链接",
                    "url": "http://www.taobao.com/"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "rselfmenu_0_1",
                    "sub_button": []
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_0",
                    "sub_button": []
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1",
                    "sub_button": []
                },
            ]
        },
        {
            "name": "下拉菜单",
            "sub_button": [
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2",
                    "sub_button": []
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                },
                {
                    "type": "media_id",
                    "name": "图片",
                    "media_id": "jDoJzHD2yfW5YxecAG9d8ijhBvCQBlynVP3QWXXAMe0"
                },
                {
                    "type": "view_limited",
                    "name": "图文消息",
                    "media_id": "1_821D3VHxMTbMuZ5-DSoIWBsxL-yM3hCmIuKS430HQ"
                }
            ]
        }
     ]
}