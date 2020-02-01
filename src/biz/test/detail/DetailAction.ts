import {ACTIONS} from "./DetailReducer"
import Fetch from "~/global/network/Fetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import {formatStr} from "~/global/util/StringUtil";
import Logger from "~/global/util/Logger"

/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "DetailAction";
export default class DetailAction {
    static onPageLoaded(pageNum: number) {
        return async dispatch => {
            let loadingUI = TipsUtil.toastLoading("加载中...")
            try {
                let response = await Fetch.post(formatStr(Api.article_list, pageNum))
                dispatch(ACTIONS.success(response.data.datas));
                TipsUtil.toastHide(loadingUI)
            } catch (err) {
                Logger.error(TAG, err)
                TipsUtil.toastHide(loadingUI)
                TipsUtil.toastFail("错误" + err)
            }
        }
    }
}