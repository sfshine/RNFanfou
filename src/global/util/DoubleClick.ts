import Logger from "~/global/util/Logger";

export default class DoubleClick {
    private performClick = false

    wrap = (action) => {
        Logger.log("DoubleClick", "wrap ,performClick = " + this.performClick)
        if (this.performClick) {
            action()
        } else {
            this.performClick = true
            setTimeout(() => this.performClick = false, 500)
        }
    }
}
