import {defaultReduce} from "~/biz/common/redux/Reducers";
import RefreshState from "~/global/components/refresh/RefreshState";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const PREFIX = "search_"
export default function SearchReducer(state, action) {
    return defaultReduce(PREFIX, action, state, initialState)
}

export function search_beginRefreshAction() {
    return {
        type: "search_beginRefreshAction",
        ptrState: RefreshState.Refreshing,
        // pageData: {page: 1, data: []},
    }
}

export function search_refreshSuccessAction(pageData, ptrState) {
    return {
        type: "search_refreshSuccessAction",
        pageData: pageData,
        ptrState: ptrState
    }
}

export function search_beginLoadMoreAction() {
    return {
        type: "search_beginLoadMoreAction",
        ptrState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}


export function search_loadMoreSuccessAction(pageData, status) {
    return {
        type: "search_loadMoreSuccessAction",
        pageData: pageData,
        ptrState: status
    }
}

export function search_loadFailAction(errorMessage) {
    return {
        type: "search_loadFailAction",
        errorMessage: errorMessage,
        ptrState: RefreshState.Idle
    }
}
