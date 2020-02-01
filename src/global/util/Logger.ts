import {formatDate} from "./DateUtil";

export default class Logger {
    static logPrefix: string = ""

    static log(tag, msg, ...optionalParams: any[]) {
        console.log(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static info(tag, msg, ...optionalParams: any[]) {
        console.info(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static warn(tag, msg, ...optionalParams: any[]) {
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }

    static error(tag, msg, ...optionalParams: any[]) {
        console.warn(`${formatDate()} ${this.logPrefix}-${tag}:${msg}`, ...optionalParams)
    }
}
