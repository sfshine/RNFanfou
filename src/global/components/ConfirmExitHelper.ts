import {BackHandler} from "react-native";
import TipsUtil from "~/global/util/TipsUtil";

export default class ConfirmExitHelper {
    private canBack: boolean;
    overrideBackPress = () => {
        if (this.canBack) {
            BackHandler.exitApp();
        } else {
            TipsUtil.toast("再按一次退出")
            this.canBack = true
            setTimeout(() => this.canBack = false, 3000)
        }
        return true
    }
}
