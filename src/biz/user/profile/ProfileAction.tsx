import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {USER_PROFILE_ACTIONS} from "~/biz/user/profile/ProfileReducer";

const PAGE_SIZE = 20
const TAG = "ProfileAction"

export default class ProfileAction {
    private pageNum = 0

    async refreshUserTimeline(userId, dispatch) {
        this.pageNum = 1
        dispatch(USER_PROFILE_ACTIONS.Refreshing())
        try {
            let response = await FanfouFetch.get(Api.statuses_user_timeline, {
                id: userId,
                page: this.pageNum,
                format: 'html'
            })
            if (!response) {
                throw "JSON数据异常"
            } else {
                dispatch(USER_PROFILE_ACTIONS.Idle(response))
            }
        } catch (err) {
            dispatch(USER_PROFILE_ACTIONS.RefreshingFailed())
            Logger.error(TAG, "refreshTimeline error", err)
            TipsUtil.toastFail("数据异常，请重试")
        }
    }

    async loadMoreUserTimeline(userId, oldPageData, dispatch) {
        this.pageNum++
        dispatch(USER_PROFILE_ACTIONS.LoadingMore())
        try {
            let response = await FanfouFetch.get(Api.statuses_user_timeline, {
                id: userId,
                page: this.pageNum,
                format: 'html'
            })
            if (!response) {
                throw "JSON数据异常"
            } else {
                let newData = oldPageData.concat(response)
                if (response.length < PAGE_SIZE) {
                    dispatch(USER_PROFILE_ACTIONS.LoadingMoreEnd(newData))
                } else {
                    dispatch(USER_PROFILE_ACTIONS.Idle(newData))
                }
                Logger.log(TAG, "load more, newData = ", oldPageData)
            }
        } catch (err) {
            this.pageNum-- //请求失败，需要把加的Page减回来。
            dispatch(USER_PROFILE_ACTIONS.LoadingMoreError())
            Logger.error(TAG, "loadMoreTimeline error", err)
        }
    }
}
