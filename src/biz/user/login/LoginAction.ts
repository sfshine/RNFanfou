import Logger from "~/global/util/Logger"
import {emptyUser, GlobalCache} from "~/global/AppGlobal";
import {ConfigUtil} from "~/global/util/ConfigUtil";
import TipsUtil from "~/global/util/TipsUtil";
import {Api, FanfouModule} from "~/biz/common/api/Api";
import {navigateResetN} from "~/global/navigator/NavigationManager";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {reduxReset} from "~/global/redux/ResetAction";


/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "LoginAction";
const KEY = 'key_user';

export default class LoginAction {
    static checkLogin(callback: (hasLogin: boolean) => void) {
        Logger.log(TAG, 'checkHasLogin start');
        ConfigUtil.get(KEY, null).then(user => {
            if (user && user.token && user.secret) {
                GlobalCache.user = user;
                FanfouModule.setToken(user.token, user.secret)
                Logger.log(TAG, '用户已经登录：', GlobalCache.user);
                callback(true)

            } else {
                Logger.log(TAG, '用户未登录',);
                callback(false)
            }
        })
    }

    static onSubmitLogin(account: string, password: string, navigation: object) {
        let loading = TipsUtil.toastLoading("登录中...")
        let accessToken = {}
        FanfouModule.login(account, password).then(result => {
            return result ? result : Promise.reject("获取token失败:" + result)
        }).then(result => {
            accessToken = {token: result.token, secret: result.secret}
            FanfouModule.setToken(result.token, result.secret)
            return FanfouFetch.get(Api.verify_credentials, {mode: 'lite'})
        }).then(userJson => {
            userJson = {...userJson, ...accessToken}
            GlobalCache.user = userJson
            ConfigUtil.set(KEY, GlobalCache.user).then()
            TipsUtil.toastSuccess("登录成功", loading)
            navigateResetN(navigation, "MainPage");
        }).catch(e => {
            TipsUtil.toastFail("登录失败,请检查用户名和密码", loading)
        })
    }

    static loadUserInfo(callback) {
        FanfouFetch.get(Api.verify_credentials, {mode: 'lite'}).then(userJson => {
            GlobalCache.user = userJson
            callback(userJson)
        }).catch()
    }

    static logout(navigation) {
        return dispatch => {
            GlobalCache.user = emptyUser;
            ConfigUtil.set(KEY, GlobalCache.user).then()
            Logger.log(TAG, "logout", GlobalCache.user)
            dispatch(reduxReset());
            navigateResetN(navigation, "LoginPage")
        }
    }
}
