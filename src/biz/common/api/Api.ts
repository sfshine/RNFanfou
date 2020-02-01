import AsyncStorage from "@react-native-community/async-storage"

export const DEV = "http://www.wanandroid.com"
export const PROD = "http://www.wanandroid.com"

export const Api = {
    HOST: DEV,
    article_list: "/article/list/{0}/json",
}

export var switchHost = (host: string) => {
    Api.HOST = host
    AsyncStorage.setItem("apiEnv", Api.HOST).then()
}