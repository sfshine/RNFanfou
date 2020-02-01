import * as types from '../../global/constants/ActionTypes';
import {queryToday} from '../../global/network/Api';
import {Toast} from 'antd-mobile-rn';
import Fetch from '../../global/network/Fetch';

export function loadToday() {
    return dispatch => {
        dispatch(beginLoading());
        Toast.loading('加载中...', 0, null, true);
        Fetch.get(queryToday()).then((json) => {
            Toast.hide();
            console.log(json);
            dispatch(loadTodaySuccess(json.results.Android.reverse()));

        }).catch((e) => {
            console.log(e);
            Toast.hide();
            let errorMsg = "加载失败";
            dispatch(loadTodayFail(errorMsg));
        }).done();
    }
}

function beginLoading() {
    return {
        type: types.GET_TODAY_LOADING,
    }
}

function loadTodaySuccess(data) {
    return {
        type: types.GET_TODAY_SUCCESS,
        data: data
    }
}

function loadTodayFail(errorMessage) {
    return {
        type: types.GET_TODAY_FAIL,
        errorMessage: errorMessage
    }
}