import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {FRIENDS_ACTIONS} from "~/biz/user/friends/FriendsReducer";

const TAG = "FriendsAction"
const PAGE_SIZE = 8

export default class FriendsAction {
    private pageNum: number;
    private url: string

    setMode(isFollowers: boolean) {
        this.url = isFollowers ? Api.statuses_followers : Api.statuses_friends
    }

    refreshFriends(id) {
        return async dispatch => {
            this.pageNum = 1
            dispatch(FRIENDS_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(this.url, {
                    id: id,
                    page: this.pageNum,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(FRIENDS_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(FRIENDS_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreFriends(id, oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(FRIENDS_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(this.url, {
                    id: id,
                    page: this.pageNum,
                    format: 'html'
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(FRIENDS_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(FRIENDS_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(FRIENDS_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
