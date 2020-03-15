import {Api} from "~/biz/common/api/Api";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {MENTION_ACTIONS} from "~/biz/compose/mention/MentionReducer";

const PAGE_SIZE = 60
const TAG = "MentionAction"

export default class MentionAction {

    private pageNum = 1
    private fullData = null

    constructor() {
        Logger.log(TAG, "constructor")
    }

    private filterInner(query) {
        if (!this.fullData) return
        let response = query ? this.fullData.filter(
            it => it.name.includes(query)
        ) : this.fullData
        return response
    }

    filter(query) {
        return dispatch => this.fullData && this.fullData.length % PAGE_SIZE == 0 ?
            dispatch(MENTION_ACTIONS.Idle(this.filterInner(query))) :
            dispatch(MENTION_ACTIONS.LoadingMoreEnd(this.filterInner(query)))
    }

    refreshFriends(query) {
        return async dispatch => {
            this.pageNum = 1
            dispatch(MENTION_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.statuses_friends, {
                    count: PAGE_SIZE,
                    page: this.pageNum,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    this.fullData = response
                    dispatch(MENTION_ACTIONS.Idle(this.filterInner(query)))
                }
            } catch (err) {
                dispatch(MENTION_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreFriends(query) {
        return async dispatch => {
            if (!this.fullData) {
                return
            }
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
                    let newData = this.fullData.concat(response)
                    this.fullData = newData
                    if (response.length < PAGE_SIZE) {
                        dispatch(MENTION_ACTIONS.LoadingMoreEnd(this.filterInner(query)))
                    } else {
                        dispatch(MENTION_ACTIONS.Idle(this.filterInner(query)))
                    }
                    Logger.log(TAG, "load more, newData = ", newData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(MENTION_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
