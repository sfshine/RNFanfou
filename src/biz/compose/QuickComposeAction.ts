import Logger from "~/global/util/Logger";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import {COMPOSE_MODE} from "~/biz/compose/QuickComposeComponent";
import SYImagePicker from "react-native-syan-image-picker";

const TAG = "QuickComposeAction";
export default class QuickComposeAction {
    static onChoosePicture(onSuccess) {
        SYImagePicker.asyncShowImagePicker({
            imageCount: 1,
            isCrop: false,
            compress: false,
        }).then(photos => {
            if (!photos || photos.length == 0) {
                Logger.log(TAG, "没有选择照片！")
            } else {
                Logger.log(TAG, "选择的图片", photos)
            }
            onSuccess(photos)
        }).catch(error => {
            Logger.log(TAG, "选择图片失败：", error)
        })
    }

    static uploadImage(input, photos, placeHolder, onSuccess) {
        let loading = TipsUtil.toastLoading('发送中...');
        //api不支持 图片转发回复,通过拼接 用户名和消息walk around
        FanfouFetch.post(Api.photos_upload,
            {
                status: input + " " + placeHolder
            },
            {
                "photo": photos[0].uri
            })
            .then(json => {
                TipsUtil.toastSuccess("发送成功", loading)
                onSuccess()
            })
            .catch(error => TipsUtil.toastFail("发送失败：" + error));
    }

    static updateMessage(mode, input, item, placeHolder, onSuccess) {
        let loading = TipsUtil.toastLoading('发送中...');
        let msgBody = mode == COMPOSE_MODE.Forward ?
            {
                status: input + " " + placeHolder,
                repost_status_id: item.id,
            } : {
                status: "@" + item.user.name + " " + input,
                in_reply_to_status_id: item.id,
            }
        FanfouFetch.post(Api.statuses_update, msgBody)
            .then(json => {
                Logger.log(TAG, json)
                TipsUtil.toastSuccess("发送成功", loading)
                onSuccess()
            })
            .catch(error => TipsUtil.toastFail("发送失败：" + error))
    }
}

