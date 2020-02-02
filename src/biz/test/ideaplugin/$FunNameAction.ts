import {ACTIONS} from "./$FunNameReducer"
import Fetch from "~/global/network/Fetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import {formatStr} from "~/global/util/StringUtil";
import Logger from "~/global/util/Logger"

/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "$FunNameAction";
export default class $FunNameAction {
    static onPageLoaded(pageNum: number) {
        return async dispatch => {
            let loadingUI = TipsUtil.toastLoading("加载中...")
            try {
                let response = await Fetch.get(formatStr(Api.article_list, pageNum))
                dispatch(ACTIONS.success(response));
                TipsUtil.toastHide(loadingUI)
            } catch (err) {
                Logger.error(TAG, err)
                TipsUtil.toastHide(loadingUI)
                TipsUtil.toastFail("错误" + err)
            }
        }
    }
}
