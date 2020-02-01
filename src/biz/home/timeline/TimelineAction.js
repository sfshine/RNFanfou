import {home_timeline} from '../../../global/network/Api';
import FanfouFetch from "../../../global/network/FanfouFetch";
import RefreshState from "../../../global/components/refresh/RefreshState";

const PAGE_SIZE = 20

export function refreshTimeline() {
    return loadTimeline({page: 1, data: []})
}

export function loadMoreTimeline(oldPageData) {
    let nextPageData = {page: oldPageData.page + 1, data: [...oldPageData.data]}
    return loadTimeline(nextPageData)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadTimeline(pageData) {
    return dispatch => {
        console.log("loadTimeline pageData", pageData);
        let isRefresh = pageData.page == 1
        isRefresh ? dispatch(timeline_beginRefreshAction()) : dispatch(timeline_beginLoadMoreAction());
        FanfouFetch.get(home_timeline(), {page: pageData.page, format: 'html'}).then((json) => {
            console.log("loadTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.NoMoreData : RefreshState.Idle
            let newPageData = {page: pageData.page, data: [...pageData.data, ...json]}
            console.log("loadTimeline newPageData", newPageData);
            isRefresh ? dispatch(timeline_refreshSuccessAction(newPageData, endStatus)) : dispatch(timeline_loadMoreSuccessAction(newPageData, endStatus))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(timeline_loadFailAction(errorMsg));
        }).done();
    }
}

function timeline_beginRefreshAction() {
    return {
        type: "timeline_beginRefreshAction",
        loadState: RefreshState.Refreshing,
        // pageData: {page: 1, data: []},
    }
}

function timeline_refreshSuccessAction(pageData, loadState) {
    return {
        type: "timeline_refreshSuccessAction",
        pageData: pageData,
        loadState: loadState
    }
}

function timeline_beginLoadMoreAction() {
    return {
        type: "timeline_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function timeline_loadMoreSuccessAction(pageData, status) {
    return {
        type: "timeline_loadMoreSuccessAction",
        pageData: pageData,
        loadState: status
    }
}

function timeline_loadFailAction(errorMessage) {
    return {
        type: "timeline_loadFailAction",
        errorMessage: errorMessage,
        loadState: RefreshState.Failure
    }
}