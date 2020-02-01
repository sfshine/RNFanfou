import * as WeChat from 'react-native-wechat';
import Logger from "./Logger";

export default class InitHelper {
    static init(GLOBAL) {
        WeChat.registerApp("wx6159aef19472b61f").then()
        console.disableYellowBox = true//禁用警告信息
        // GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest
        Logger.logPrefix = "RNArch"
    }
}