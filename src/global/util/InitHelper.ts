import * as WeChat from 'react-native-wechat';
import Logger from "./Logger";
import {FanfouModule} from "~/biz/common/api/Api";


export default class InitHelper {
    static async init(GLOBAL) {
        console.disableYellowBox = true//禁用警告信息
        // GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest
        Logger.logPrefix = "RNFanfou"
        WeChat.registerApp("wx6159aef19472b61f").then()
        FanfouModule.config({
            apiHost: "http://api.fanfou.com",
            apiKey: "f8f2e5b37b3be465faf4ec4d405d0a58",
            apiSecret: "d7b591d25789a8ee47decadacd425474",
            callbackUrl: "http://m.fanfou.com",
        });
    }
}
