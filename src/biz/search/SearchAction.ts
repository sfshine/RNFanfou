import RefreshState from "~/global/components/refresh/RefreshState";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import {
    search_beginLoadMoreAction, search_beginRefreshAction,
    search_loadFailAction,
    search_loadMoreSuccessAction,
    search_refreshSuccessAction
} from "~/biz/search/SearchReducer";

const PAGE_SIZE = 20

export class SearchAction {
    search(q) {
        return this.loadSearchTimeline(q, {page: 1, data: []})
    }

    loadMore(q, oldPageData) {
        let nextPageData = {page: oldPageData.page + 1, data: [...oldPageData.data]}
        return this.loadSearchTimeline(q, nextPageData)
    }

    /**
     * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
     * @param paging
     * @returns {Function}
     */
    loadSearchTimeline(q, pageData) {
        return dispatch => {
            console.log("loadSearchTimeline pageData", pageData);
            let isRefresh = pageData.page == 1
            isRefresh ? dispatch(search_beginRefreshAction()) : dispatch(search_beginLoadMoreAction());
            FanfouFetch.get(Api.search_public_timeline, {page: pageData.page, q: q, format: 'html'}).then((json) => {
                console.log("loadSearchTimeline json", json);
                //无论什么时候获取的数据不够一页就要显示没有更多数据了
                let endStatus = json.length < PAGE_SIZE ? RefreshState.LoadingMoreEnd : RefreshState.Idle
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

    static getSearchWordList() {
        return dispatch => {
            FanfouFetch.get(Api.saved_searches_list).then(json => {
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

    static createSearchWord(query) {
        return FanfouFetch.post(Api.saved_searches_create, {query: query});
    }

    static destroySearchWord(queryId) {
        return FanfouFetch.post(Api.saved_searches_destroy, {id: queryId})
    }

    static search_cancel() {
        return {
            type: "search_cancel",
            pageData: null,
            ptrState: RefreshState.Idle,
        }
    }
}
