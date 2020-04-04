import AsyncStorage from "@react-native-community/async-storage"
import {NativeModules} from "react-native";

export const FanfouModule = NativeModules.FanfouModule;

export const DEV = "http://www.wanandroid.com"
export const PROD = "http://www.wanandroid.com"

export const Api = {
    HOST: DEV,
    article_list: "/article/list/{0}/json",
    queryToday: "http://gank.io/api/today",
    verify_credentials: "/account/verify_credentials",
    home_timeline: "/statuses/home_timeline",
    statuses_public_timeline: "/statuses/public_timeline",
    photos_upload: "/photos/upload",
    statuses_update: "/statuses/update",
    statuses_user_timeline: "/statuses/user_timeline",
    statuses_friends: "/statuses/friends",
    search_users: "/search/users",
    users_show: "/users/show",
    friendships_create: "/friendships/create",
    friendships_destroy: "/friendships/destroy",
    statuses_context_timeline: "/statuses/context_timeline",
    statuses_followers: "/statuses/followers",
    statuses_destroy: "/statuses/destroy",
    search_public_timeline: "/search/public_timeline",
    favorites_create: "/favorites/create/:",
    favorites_destroy: "/favorites/destroy/:",
    saved_searches_list: "/saved_searches/list",
    saved_searches_create: "/saved_searches/create",
    saved_searches_destroy: "/saved_searches/destroy",
    favorites: "/favorites",
    user_timeline: "/photos/user_timeline",
    mentions: "/statuses/mentions",
    update_profile: "/account/update_profile",
}

export var switchHost = (host: string) => {
    Api.HOST = host
    AsyncStorage.setItem("apiEnv", Api.HOST).then()
}
