import * as WeChat from 'react-native-wechat';
import Logger from "./Logger";
import {FanfouModule} from "~/biz/common/api/Api";


export default class InitHelper {
    static async init(GLOBAL) {
        // console.disableYellowBox = true//禁用警告信息
        // GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest
        Logger.logPrefix = "RNFanfou"
        WeChat.registerApp("wx6159aef19472b61f").then()
        FanfouModule.config({
            apiHost: "http://api.fanfou.com",
            apiKey: "061bd1b03d10fe5edfb732abe1193cad",
            apiSecret: "ada14ba47291c8fa16eef931236412d1",
            callbackUrl: "http://m.fanfou.com",
        });
    }
}
