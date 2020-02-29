import {formatDate} from "./DateUtil";

export default class Logger {
    static dev = __DEV__
    static logPrefix: string = ""

    static log(tag, msg, ...optionalParams: any[]) {
        if (!this.dev) return
        console.log(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static info(tag, msg, ...optionalParams: any[]) {
        if (!this.dev) return
        console.info(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static warn(tag, msg, ...optionalParams: any[]) {
        if (!this.dev) return
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static error(tag, msg, ...optionalParams: any[]) {
        if (!this.dev) return
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }
}
