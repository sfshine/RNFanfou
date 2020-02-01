import FanfouFetch from "../../global/network/FanfouFetch";
import RefreshState from "../../global/components/refresh/RefreshState";
import {
    saved_searches_list,
    saved_searches_create,
    search_public_timeline,
    saved_searches_destroy
} from "../../global/network/Api";

const PAGE_SIZE = 20

export function search_cancel() {
    return {
        type: "search_cancel",
        pageData: null,
        loadState: RefreshState.NoMoreData,
    }
}

export function search(q) {
    return loadSearchTimeline(q, {page: 1, data: []})
}

export function loadMore(q, oldPageData) {
    let nextPageData = {page: oldPageData.page + 1, data: [...oldPageData.data]}
    return loadSearchTimeline(q, nextPageData)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadSearchTimeline(q, pageData) {
    return dispatch => {
        console.log("loadSearchTimeline pageData", pageData);
        let isRefresh = pageData.page == 1
        isRefresh ? dispatch(search_beginRefreshAction()) : dispatch(search_beginLoadMoreAction());
        FanfouFetch.get(search_public_timeline(), {page: pageData.page, q: q, format: 'html'}).then((json) => {
            console.log("loadSearchTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.NoMoreData : RefreshState.Idle
            let newPageData = {page: pageData.page, data: [...pageData.data, ...json]}
            console.log("loadSearchTimeline newPageData", newPageData);
            isRefresh ? dispatch(search_refreshSuccessAction(newPageData, endStatus)) : dispatch(search_loadMoreSuccessAction(newPageData, endStatus))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(search_loadFailAction(errorMsg));
        }).done();
    }
}

function search_beginRefreshAction() {
    return {
        type: "search_beginRefreshAction",
        loadState: RefreshState.Refreshing,
        // pageData: {page: 1, data: []},
    }
}

function search_refreshSuccessAction(pageData, loadState) {
    return {
        type: "search_refreshSuccessAction",
        pageData: pageData,
        loadState: loadState
    }
}

function search_beginLoadMoreAction() {
    return {
        type: "search_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function search_loadMoreSuccessAction(pageData, status) {
    return {
        type: "search_loadMoreSuccessAction",
        pageData: pageData,
        loadState: status
    }
}

function search_loadFailAction(errorMessage) {
    return {
        type: "search_loadFailAction",
        errorMessage: errorMessage,
        loadState: RefreshState.Failure
    }
}

export function getSearchWordList() {
    return dispatch => {
        FanfouFetch.get(saved_searches_list()).then(json => {
            console.log("saved_searches_list json", json);
            dispatch({
                type: "search_searches_list_success",
                search_searches_list: json
            })
        }).catch(e => {
            console.error("saved_searches_list error:", e)
            dispatch({
                type: "search_searches_list_fail",
                errorMessage: e.toString(),
            })
        })
    }
}

export function createSearchWord(query) {
    return FanfouFetch.post(saved_searches_create(), {query: query});
}

export function destroySearchWord(queryId) {
    return FanfouFetch.post(saved_searches_destroy(), {id: queryId})
}
