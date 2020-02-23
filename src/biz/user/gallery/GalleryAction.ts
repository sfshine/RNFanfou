import {GALLERY_ACTIONS} from "./GalleryReducer"
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import Logger from "~/global/util/Logger"
import FanfouFetch from "~/biz/common/api/FanfouFetch";

/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "GalleryAction";
const PAGE_SIZE = 24

export default class GalleryAction {
    private pageNum: number;

    onPageLoaded(userId) {
        return async dispatch => {
            this.pageNum = 1
            dispatch(GALLERY_ACTIONS.Refreshing())
            try {
                let response = await FanfouFetch.get(Api.user_timeline, {
                    id: userId,
                    page: this.pageNum,
                    format: 'html',
                    count: PAGE_SIZE,
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    dispatch(GALLERY_ACTIONS.Idle(response))
                }
            } catch (err) {
                dispatch(GALLERY_ACTIONS.RefreshingFailed())
                Logger.error(TAG, "refreshTimeline error", err)
                TipsUtil.toastFail("数据异常，请重试")
            }
        }
    }

    loadMore(userId, oldPageData) {
        return async dispatch => {
            this.pageNum++
            dispatch(GALLERY_ACTIONS.LoadingMore())
            try {
                let response = await FanfouFetch.get(Api.user_timeline, {
                    id: userId,
                    page: this.pageNum,
                    format: 'html',
                    count: PAGE_SIZE,
                })
                if (!response) {
                    throw "JSON数据异常"
                } else {
                    let newData = oldPageData.concat(response)
                    if (response.length < PAGE_SIZE) {
                        dispatch(GALLERY_ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(GALLERY_ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, newData = ", oldPageData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(GALLERY_ACTIONS.LoadingMoreError())
                Logger.error(TAG, "loadMoreTimeline error", err)
            }
        }
    }
}
