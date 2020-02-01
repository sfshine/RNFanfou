import UserDao from "../UserDao";
import Global from '../../../global/Global';
import {NativeModules} from "react-native";
import FanfouFetch from "../../../global/network/FanfouFetch";
import * as Api from "../../../global/network/Api";

const LoginActionType = {
    LOGIN_PROCESSING: "login_processing",
    LOGIN_SUCCESS: "login_success",
    LOGIN_FAIL: "login_fail",
    LOGIN_HAS_LOGIN: "login_has_login",
    LOGIN_CHECKING_LOGIN: "login_checking_login",
    LOGIN_LOGOUT: "login_logout",
}

const FanfouModule = NativeModules.FanfouModule;

export function logout() {
    return dispatch => {
        console.log("logout start")
        UserDao.clear();
        Global.user = null;
        dispatch(logoutAction("用户未登录"));
    }
}

export function checkHasLogin() {
    return dispatch => {
        dispatch(checkingLogin());
        console.log('checkHasLogin start');
        UserDao.fetch().then(user => {
            if (user && user.token && user.secret) {
                dispatch(hasLogin(user));
                Global.user = user;
                FanfouModule.setToken(user.token, user.secret)
                console.log('用户已经登录：', Global.user);
            } else {
                dispatch(loginFail("用户未登录"));
            }
        }).catch(err => {
            console.log("UserDao.fetch() err " + err);
            dispatch(loginFail("用户未登录"));
        });
    }
}

export function login(account, pwd) {
    //then 方法返回的可以是数据,也可以是一个Promise, 如果是Promise,则下一个then是这个Promise执行以后的结果
    return dispatch => {
        dispatch(isLoginOnGoing());
        let accessToken = {}
        FanfouModule.login(account, pwd).then(result => {
            return result ? result : Promise.reject("获取token失败:" + result)
        }).then(result => {
            accessToken = {token: result.token, secret: result.secret}
            FanfouModule.setToken(result.token, result.secret)
            return FanfouFetch.get(Api.verify_credentials(), {mode: 'lite'})
        }).then(userJson => {
            userJson = {...userJson, ...accessToken}
            console.log(userJson)
            Global.user = userJson
            UserDao.save(userJson)
            dispatch(loginSuccess(userJson))
        }).catch(e => {
            dispatch(loginFail("登录失败:" + e));
        })
    }
}

//---------------------------检查登录--------------------------
function checkingLogin() {
    return {
        type: LoginActionType.LOGIN_CHECKING_LOGIN,
        loading: true,
    }
}

function hasLogin() {
    return {
        type: LoginActionType.LOGIN_HAS_LOGIN,
        loading: false,
        hasLogin: true,
    }
}

function logoutAction(msg) {
    return {
        type: LoginActionType.LOGIN_LOGOUT,
        loading: false,
        hasLogin: false,
        errorMessage: msg,
        isSuccess: false,
    }
}

//---------------------------网络登录--------------------------

function isLoginOnGoing() {
    return {
        type: LoginActionType.LOGIN_PROCESSING,
        loading: true,
    }
}

function loginSuccess() {
    return {
        type: LoginActionType.LOGIN_SUCCESS,
        loading: false,
        isSuccess: true,
    }
}

//---------------------------通用--------------------------
function loginFail(errorMsg) {
    return {
        type: LoginActionType.LOGIN_FAIL,
        loading: false,
        hasLogin: false,
        errorMessage: errorMsg,
        isSuccess: false,
    }
}