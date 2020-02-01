import {Portal, Toast} from '@ant-design/react-native'

export default class TipsUtil {
    static toast(str, keyToHide?) {
        this.toastHide(keyToHide)
        return Toast.info(str, 1)
    }

    static toastSuccess(str, keyToHide?) {
        this.toastHide(keyToHide)
        return Toast.success(str, 1)
    }

    static toastFail(str, keyToHide?) {
        this.toastHide(keyToHide)
        return Toast.fail(str.toString(), 1)
    }

    static toastLoading(str, keyToHide?) {
        this.toastHide(keyToHide)
        return Toast.loading(str, 0, null, true);
    }

    static toastHide(key) {
        if (key) {
            Portal.remove(key)
        }
    }
}
