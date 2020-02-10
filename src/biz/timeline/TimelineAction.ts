import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import {TIMELINE_ACTIONS} from "~/biz/timeline/TimelineReducer";
import TipsUtil from "~/global/util/TipsUtil";

const PAGE_SIZE = 8
const TAG = "TimelineAction"
export default class TimelineAction {
    private pageNum: number;

    refreshTimeline() {
        return async dispatch => {
            this.pageNum = 1
            dispatch(TIMELINE_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.home_timeline, {page: this.pageNum, format: 'html'})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(TIMELINE_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(TIMELINE_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreTimeline(oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(TIMELINE_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.home_timeline, {page: this.pageNum, format: 'html'})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(TIMELINE_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(TIMELINE_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(TIMELINE_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
