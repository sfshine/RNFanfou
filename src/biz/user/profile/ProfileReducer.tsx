import {defaultReduce} from "~/biz/common/redux/Reducers";
import RefreshState from "~/global/components/refresh/RefreshState";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const TAG = "ProfileReducer"
export default function ProfileReducer(state, action) {
    return defaultReduce(TAG, action, state, initialState)
}

export function profile_beginRefreshAction(userId) {
    return {
        type: TAG + "#" + "profile_beginRefreshAction",
        loadState: RefreshState.Refreshing,
        pageData: {},
        userId: userId,
    }
}

export function profile_refreshSuccessAction(userId, pageData, loadState) {
    return {
        type: TAG + "#" + "profile_refreshSuccessAction",
        userId: userId,
        pageData: pageData,
        loadState: loadState
    }
}

export function profile_beginLoadMoreAction() {
    return {
        type: TAG + "#" + "profile_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

export function profile_loadMoreSuccessAction(userId, pageData, status) {
    return {
        type: TAG + "#" + "profile_loadMoreSuccessAction",
        userId: userId,
        pageData: pageData,
        loadState: status
    }
}

export function profile_loadFailAction(userId, errorMessage) {
    return {
        type: TAG + "#" + "profile_loadFailAction",
        userId: userId,
        errorMessage: errorMessage,
        loadState: RefreshState.LoadingMoreEnd,//有些拉取不到数据的异常情况是因为用户设置了不可见
        pageData: {}
    }
}
