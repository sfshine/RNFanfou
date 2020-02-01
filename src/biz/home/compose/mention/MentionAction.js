import {statuses_friends, search_users} from '../../../../global/network/Api';
import FanfouFetch from "../../../../global/network/FanfouFetch";
import RefreshState from "../../../../global/components/refresh/RefreshState";

const PAGE_SIZE = 50

export function refreshFriends() {
    return loadUsers(statuses_friends(), {pageIndex: 1, data: []})
}

export function loadMoreFriends(oldPageData) {
    let nextPageData = {pageIndex: oldPageData.pageIndex + 1, data: [...oldPageData.data]}
    return loadUsers(statuses_friends(), nextPageData)
}

export function searchUsers(text) {
    return loadUsers(search_users(), {q: text, pageIndex: 1, data: []})
}

export function searchUsersLoadMore(text, oldPageData) {
    let nextPageData = {q: text, pageIndex: oldPageData.pageIndex + 1, data: [...oldPageData.data]}
    return loadUsers(search_users, nextPageData)
}

/**
 * 刷新, paging 传入{pageIndex:1, data:{}}, load more传入 {pageIndex:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadUsers(api, pageData) {
    return dispatch => {
        console.log("loadTimeline pageData", pageData);
        let isRefresh = pageData.pageIndex == 1
        if (api == statuses_friends()) {
            isRefresh ? dispatch(mention_beginRefreshAction()) : dispatch(mention_beginLoadMoreAction());
        } else {
            isRefresh ? dispatch(mention_search_beginRefreshAction()) : dispatch(mention_search_beginLoadMoreAction());
        }
        FanfouFetch.get(api, {q: pageData.q, count: PAGE_SIZE, page: pageData.pageIndex}).then((json) => {
            console.log("loadTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.NoMoreData : RefreshState.Idle
            let newPageData = {pageIndex: pageData.pageIndex, data: [...pageData.data, ...json]}
            console.log("loadTimeline newPageData", newPageData);
            if (api == statuses_friends()) {
                isRefresh ? dispatch(mention_refreshSuccessAction(newPageData, endStatus)) : dispatch(mention_loadMoreSuccessAction(newPageData, endStatus))
            } else {
                isRefresh ? dispatch(mention_search_refreshSuccessAction(newPageData, endStatus)) : dispatch(mention_search_loadMoreSuccessAction(newPageData, endStatus))
            }
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            if (api == statuses_friends()) {
                dispatch(mention_loadFailAction(errorMsg));
            } else {
                dispatch(mention_search_loadFailAction(errorMsg));
            }
        }).done();
    }
}

function mention_beginRefreshAction() {
    return {
        type: "mention_beginRefreshAction",
        loadState: RefreshState.Refreshing
    }
}

function mention_refreshSuccessAction(pageData, loadState) {
    return {
        type: "mention_refreshSuccessAction",
        pageData: pageData,
        loadState: loadState
    }
}

function mention_beginLoadMoreAction() {
    return {
        type: "mention_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function mention_loadMoreSuccessAction(pageData, status) {
    return {
        type: "mention_loadMoreSuccessAction",
        pageData: pageData,
        loadState: status
    }
}

function mention_loadFailAction(errorMessage) {
    return {
        type: "mention_loadFailAction",
        errorMessage: errorMessage,
        loadState: RefreshState.Failure
    }
}

function mention_search_beginRefreshAction() {
    return {
        type: "mention_search_beginRefreshAction",
        searchLoadState: RefreshState.Refreshing
    }
}

function mention_search_beginLoadMoreAction() {
    return {
        type: "mention_search_beginLoadMoreAction",
        searchLoadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function mention_search_loadFailAction(errorMessage) {
    return {
        type: "mention_search_loadFailAction",
        searchErrorMessage: errorMessage,
        searchLoadState: RefreshState.Failure
    }
}

function mention_search_refreshSuccessAction(pageData, loadState) {
    return {
        type: "mention_search_refreshSuccessAction",
        searchPageData: pageData,
        searchLoadState: loadState
    }
}

function mention_search_loadMoreSuccessAction(pageData, status) {
    return {
        type: "mention_search_loadMoreSuccessAction",
        searchPageData: pageData,
        searchLoadState: status
    }
}