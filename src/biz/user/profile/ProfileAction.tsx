import RefreshState from "../../../global/components/refresh/RefreshState";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import {
    profile_beginLoadMoreAction,
    profile_beginRefreshAction, profile_loadFailAction, profile_loadMoreSuccessAction,
    profile_refreshSuccessAction
} from "~/biz/user/profile/ProfileReducer";
import Logger from "~/global/util/Logger";

const PAGE_SIZE = 20
const TAG = "ProfileAction"

export function refreshUserTimeline(userId) {
    return loadTimeline(userId, {page: 1, data: []})
}

export function loadMoreUserTimeline(userId, oldPageData) {
    let nextPageData = {page: oldPageData.page + 1, data: oldPageData.data ? [...oldPageData.data] : []}
    return loadTimeline(userId, nextPageData)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadTimeline(userId, pageData) {
    return dispatch => {
        Logger.log(TAG, "loadTimeline pageData", pageData);
        let isRefresh = pageData.page == 1
        isRefresh ? dispatch(profile_beginRefreshAction(userId)) : dispatch(profile_beginLoadMoreAction());
        FanfouFetch.get(Api.statuses_user_timeline, {id: userId, page: pageData.page, format: 'html'}).then((json) => {
            Logger.log(TAG, "loadTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = json.length < PAGE_SIZE ? RefreshState.LoadingMoreEnd : RefreshState.Idle
            let newPageData = {page: pageData.page, data: [...pageData.data, ...json]}
            Logger.log(TAG, "loadTimeline newPageData", newPageData);
            isRefresh ? dispatch(profile_refreshSuccessAction(userId, newPageData, endStatus)) : dispatch(profile_loadMoreSuccessAction(userId, newPageData, endStatus))
        }).catch((e) => {
            let errorMsg = "加载失败";
            dispatch(profile_loadFailAction(userId, errorMsg));
            Logger.log(TAG, errorMsg, e);
        }).done();
    }
}
