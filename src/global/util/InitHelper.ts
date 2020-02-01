import * as WeChat from 'react-native-wechat';
import Logger from "./Logger";
import {NativeModules} from "react-native";
const FanfouModule = NativeModules.FanfouModule;

export default class InitHelper {
    static init(GLOBAL) {
        WeChat.registerApp("wx6159aef19472b61f").then()
        FanfouModule.config({
            apiHost: "http://api.fanfou.com",
            apiKey: "a3bec0870d3be1208a78447fb00a30f4",
            apiSecret: "f05f8fd34ac928753f2270cb387af8d9",
            callbackUrl: "http://m.fanfou.com",
        });
        console.disableYellowBox = true//禁用警告信息
        // GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest
        Logger.logPrefix = "RNArch"
    }
}
