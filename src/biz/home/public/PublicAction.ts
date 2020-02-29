import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {PUBLIC_ACTIONS} from "~/biz/home/public/PublicReducer";

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
const PAGE_SIZE = 20
const TAG = "PublicAction"

export class PublicAction {
    private max_id: number;

    loadPublicTimeline() {
        return async dispatch => {
            dispatch(PUBLIC_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.statuses_public_timeline, {
                    format: 'html',
                    count: PAGE_SIZE
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    this.max_id = response.length > 0 ? response[response.length - 1].id : null
                    dispatch(PUBLIC_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(PUBLIC_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMore(oldPageData) {
        return async dispatch => {
            dispatch(PUBLIC_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.statuses_public_timeline, {
                    max_id: this.max_id,
                    format: 'html',
                    count: PAGE_SIZE
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    this.max_id = newData.length > 0 ? newData[response.length - 1].id : null
                    if (response.length < PAGE_SIZE) {
                        dispatch(PUBLIC_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(PUBLIC_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                dispatch(PUBLIC_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
