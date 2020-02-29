import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {SEARCH_ACTIONS} from "~/biz/search/SearchReducer";

const PAGE_SIZE = 20
const TAG = "SearchAction"

export class SearchAction {
    private max_id: number;

    search(q) {
        return async dispatch => {
            dispatch(SEARCH_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.search_public_timeline, {
                    q: q,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    this.max_id = response.length > 0 ? response[response.length - 1].id : null
                    dispatch(SEARCH_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(SEARCH_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMore(q, oldPageData) {
        return async dispatch => {
            dispatch(SEARCH_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.search_public_timeline, {
                    max_id: this.max_id,
                    q: q,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    this.max_id = newData.length > 0 ? newData[response.length - 1].id : null
                    if (response.length < PAGE_SIZE) {
                        dispatch(SEARCH_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(SEARCH_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                dispatch(SEARCH_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }

    static getSearchWordList() {
        return dispatch => {
            FanfouFetch.get(Api.saved_searches_list).then(json => {
                Logger.log(TAG, "saved_searches_list json", json);
                dispatch(SEARCH_ACTIONS.SearchesListSuccess(json))
            }).catch(e => {
                Logger.error(TAG, "saved_searches_list error:", e)
                dispatch(SEARCH_ACTIONS.SearchListFail(e.toString()))
            })
        }
    }

    static createSearchWord(query) {
        return FanfouFetch.post(Api.saved_searches_create, {query: query});
    }

    static destroySearchWord(queryId) {
        return FanfouFetch.post(Api.saved_searches_destroy, {id: queryId})
    }
}
