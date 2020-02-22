import RefreshState from "../../../global/components/refresh/RefreshState";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {FAV_ACTIONS} from "~/biz/user/favourite/FavouriteReducer";

const PAGE_SIZE = 20
const TAG = "FavouriteAction"
export default class FavouriteAction {
    private pageNum: number;

    refreshTimeline(userId) {
        return async dispatch => {
            this.pageNum = 1
            dispatch(FAV_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.favorites, {page: this.pageNum, format: 'html', id: userId})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(FAV_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(FAV_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMoreTimeline(userId, oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(FAV_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.favorites, {page: this.pageNum, format: 'html', id: userId})
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(FAV_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(FAV_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(FAV_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }

}
