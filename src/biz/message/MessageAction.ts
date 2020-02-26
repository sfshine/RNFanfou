import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {ACTIONS} from "~/biz/message/MessageReducer";

const PAGE_SIZE = 8
const TAG = "MessageAction"
export default class MessageAction {
    private pageNum: number;

    refreshTimeline() {
        return async dispatch => {
            this.pageNum = 1
            dispatch(ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.mentions, {page: this.pageNum, format: 'html'})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err.toString())
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreTimeline(oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.mentions, {page: this.pageNum, format: 'html'})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
