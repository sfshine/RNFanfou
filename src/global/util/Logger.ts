import {formatDate} from "./DateUtil";

const dev = __DEV__
export default class Logger {
    static logPrefix: string = ""

    static log(tag, msg, ...optionalParams: any[]) {
        if (!dev) return
        console.log(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static info(tag, msg, ...optionalParams: any[]) {
        if (!dev) return
        console.info(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static warn(tag, msg, ...optionalParams: any[]) {
        if (!dev) return
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static error(tag, msg, ...optionalParams: any[]) {
        if (!dev) return
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }
}
