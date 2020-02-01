import {Portal, Toast} from '@ant-design/react-native'

export default class TipsUtil {
    static toast(str, time?: |1) {
        return Toast.info(str, time)
    }

    static toastSuccess(str) {
        return Toast.success(str, 1)
    }

    static toastFail(str) {
        return Toast.fail(str.toString(), 1)
    }

    static toastLoading(str) {
        return Toast.loading(str, 0, null, true);
    }

    static toastHide(key) {
        Portal.remove(key)
    }
}
