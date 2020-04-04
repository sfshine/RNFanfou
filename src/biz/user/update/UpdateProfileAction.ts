import Fetch from "~/global/network/Fetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import Logger from "~/global/util/Logger"
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {GlobalCache} from "~/global/AppGlobal";

/**
 * @author Alex
 * @date 2020/01/05
 */
const TAG = "UpdateProfileAction";
export default class UpdateProfileAction {
    static async updateProfile(user: any) {
        let loadingUI = TipsUtil.toastLoading("更新中...")
        try {
            let userResp = await FanfouFetch.post(Api.update_profile, {
                name: user.name,
                location: user.location,
                description: user.description,
            })
            TipsUtil.toastHide(loadingUI)
            if (userResp) {
                GlobalCache.user = userResp
                TipsUtil.toastSuccess("操作成功")
                return userResp
            } else {
                TipsUtil.toastFail("更新失败")
            }
        } catch (err) {
            Logger.error(TAG, err)
            TipsUtil.toastHide(loadingUI)
            TipsUtil.toastFail("错误" + err)
        }
    }
}
