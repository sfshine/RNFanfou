import {ACTIONS} from "./HomeReducer"
import Fetch from "~/global/network/Fetch";
import {Api} from "~/biz/common/api/Api";
import {formatStr} from "~/global/util/StringUtil";
import Logger from "~/global/util/Logger"

/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "HomeAction";
const PAGE_SIZE = 20;
export default class HomeAction {
    private static pageNum = 0

    static onPageRefresh() {
        return async dispatch => {
            this.pageNum = 0
            dispatch(ACTIONS.Refreshing())
            try {
                let response = await Fetch.get(formatStr(Api.article_list, this.pageNum))
                if (!response.data || !response.data.datas) {
                    throw "JSON数据异常"
                } else {
                    dispatch(ACTIONS.Idle(response.data.datas))
                }
            } catch (err) {
                dispatch(ACTIONS.RefreshingFailed())
                Logger.error(TAG, "error", err)
            }
        }
    }

    static onPageLoadMore(actionData) {
        return async dispatch => {
            this.pageNum++
            dispatch(ACTIONS.LoadingMore())
            try {
                let response = await Fetch.get(formatStr(Api.article_list, this.pageNum))
                if (!response.data || !response.data.datas) {
                    throw "JSON数据异常"
                } else {
                    let listData = response.data.datas
                    let newData = actionData.concat(listData)
                    if (listData.length < PAGE_SIZE) {
                        dispatch(ACTIONS.LoadingMoreEnd(newData))
                    } else {
                        dispatch(ACTIONS.Idle(newData))
                    }
                    Logger.log(TAG, "load more, actionData = ", actionData)
                }
            } catch (err) {
                this.pageNum-- //请求失败，需要把加的Page减回来。
                dispatch(ACTIONS.LoadingMoreError())
                Logger.error(TAG, "error", err)
            }
        }
    }
}
