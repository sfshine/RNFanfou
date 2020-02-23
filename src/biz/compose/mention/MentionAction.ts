import {Api} from "~/biz/common/api/Api";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {MENTION_ACTIONS} from "~/biz/compose/mention/MentionReducer";

const PAGE_SIZE = 50
const TAG = "MentionAction"

export default class MentionAction {

    private pageNum = 1

    refreshFriends() {
        return async dispatch => {
            this.pageNum = 1
            // dispatch(MENTION_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.statuses_friends, {
                    count: PAGE_SIZE,
                    page: this.pageNum,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(MENTION_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(MENTION_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreFriends(oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(MENTION_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.statuses_friends, {
                    count: PAGE_SIZE,
                    page: this.pageNum,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(MENTION_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(MENTION_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(MENTION_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
