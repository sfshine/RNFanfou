import Fetch from "~/global/network/Fetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import Logger from "~/global/util/Logger"
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {GlobalCache} from "~/global/AppGlobal";
import SYImagePicker from "react-native-syan-image-picker";

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
                url: user.url,
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

    static async updateAvatar(onSuccess) {
        let loading
        try {
            let photos = await SYImagePicker.asyncShowImagePicker({
                imageCount: 1,
                isCrop: false,
                compress: false,
                isGif: true,
            })
            Logger.log(TAG, "choose image end")
            if (photos && photos.length > 0) {
                loading = TipsUtil.toastLoading('图片上传中...');
                let user = await FanfouFetch.post(Api.update_profile_image, null, {"image": photos[0].uri})
                TipsUtil.toastSuccess("上传图片成功", loading)
                onSuccess && onSuccess(user)
            }
        } catch (e) {
            TipsUtil.toastFail("上传图片出错,请重试", loading)
        }
    }
}
