import FanfouFetch from "../../../global/network/FanfouFetch";
import RefreshState from "../../../global/components/refresh/RefreshState";

const PAGE_SIZE = 20

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
export function loadTimeline(api, bundle, actions) {
    return dispatch => {
        console.log("loadTimeline bundle", bundle);
        let isRefresh = bundle.pageIndex == 1
        isRefresh ? dispatch(actions.timeline_beginRefreshAction()) : dispatch(actions.timeline_beginLoadMoreAction());
        FanfouFetch.get(api, {page: bundle.pageIndex, format: 'html', ...bundle.extParams}).then((json) => {
            console.log("loadTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.NoMoreData : RefreshState.Idle
            let newBundle = {pageIndex: bundle.pageIndex, pageData: [...bundle.pageData, ...json]}
            console.log("loadTimeline newBundle", newBundle);
            isRefresh ? dispatch(actions.timeline_refreshSuccessAction(newBundle, endStatus)) : dispatch(actions.timeline_loadMoreSuccessAction(newBundle, endStatus))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(actions.timeline_loadFailAction(errorMsg));
        }).done();
    }
}
