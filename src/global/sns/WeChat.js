import * as WeChat from "react-native-wechat";
import {toastFail, toastSuccess} from "../util/TipsUtil";

export default class WeChat {

    static async shareToFriend(title, description, webpageUrl) {
        WeChat.shareToSession({
            type: 'news',
            webpageUrl: webpageUrl,
            title: title,
            description: description
        }).then((response) => {
            console.log(response);
            toastSuccess('分享成功')
        }).catch((error) => {
            let errorCode = Number(error.code);
            if (errorCode === -2) {
                toastSuccess('分享已取消')
            } else {
                toastSuccess('分享失败')
            }
        })
    }

    static async shareToTimeline(title, description, webpageUrl) {
        WeChat.shareToTimeline({
            type: 'news',
            webpageUrl: webpageUrl,
            title: title,
            description: description
        }).then((response) => {
            console.log(response);
            toastSuccess('分享成功')
        }).catch((error) => {
            let errorCode = Number(error.code);
            if (errorCode === -2) {
                toastSuccess('分享已取消')
            } else {
                toastSuccess('分享失败')
            }
        })
    }
}

