import {statuses_user_timeline} from '../../../global/network/Api';
import FanfouFetch from "../../../global/network/FanfouFetch";
import RefreshState from "../../../global/components/refresh/RefreshState";

const PAGE_SIZE = 20

export function refreshUserTimeline(userId) {
    return loadTimeline(userId, {page: 1, data: []})
}

export function loadMoreUserTimeline(userId, oldPageData) {
    let nextPageData = {page: oldPageData.page + 1, data: [...oldPageData.data]}
    return loadTimeline(userId, nextPageData)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadTimeline(userId, pageData) {
    return dispatch => {
        console.log("loadTimeline pageData", pageData);
        let isRefresh = pageData.page == 1
        isRefresh ? dispatch(profile_beginRefreshAction(userId)) : dispatch(profile_beginLoadMoreAction());
        FanfouFetch.get(statuses_user_timeline(), {id: userId, page: pageData.page, format: 'html'}).then((json) => {
            console.log("loadTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.NoMoreData : RefreshState.Idle
            let newPageData = {page: pageData.page, data: [...pageData.data, ...json]}
            console.log("loadTimeline newPageData", newPageData);
            isRefresh ? dispatch(profile_refreshSuccessAction(userId, newPageData, endStatus)) : dispatch(profile_loadMoreSuccessAction(userId, newPageData, endStatus))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(profile_loadFailAction(userId, errorMsg));
        }).done();
    }
}

function profile_beginRefreshAction(userId) {
    return {
        type: "profile_beginRefreshAction",
        loadState: RefreshState.Refreshing,
        pageData: {},
        userId: userId,
    }
}

function profile_refreshSuccessAction(userId, pageData, loadState) {
    return {
        type: "profile_refreshSuccessAction",
        userId: userId,
        pageData: pageData,
        loadState: loadState
    }
}

function profile_beginLoadMoreAction() {
    return {
        type: "profile_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function profile_loadMoreSuccessAction(userId, pageData, status) {
    return {
        type: "profile_loadMoreSuccessAction",
        userId: userId,
        pageData: pageData,
        loadState: status
    }
}

function profile_loadFailAction(userId, errorMessage) {
    return {
        type: "profile_loadFailAction",
        userId: userId,
        errorMessage: errorMessage,
        loadState: RefreshState.NoMoreData,//有些拉取不到数据的异常情况是因为用户设置了不可见
        pageData: {}
    }
}