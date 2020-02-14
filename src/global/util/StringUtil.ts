import Logger from "~/global/util/Logger"

const TAG = "StringUtil"

export function removeHtmlTag(htmlText): string {
    return htmlText.replace(/<[^>]+>/g, '')
}

export function formatStr(str: string, ...args: any[]): string {
    if (args.length == 0) return str;
    let param = args[0];
    let newStr = str;
    if (typeof (param) == 'object') {
        for (let key in param)
            newStr = newStr.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return newStr;
    } else {
        for (let i = 0; i < args.length; i++)
            newStr = newStr.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        // Logger.log(TAG, "formatStr", newStr)
        // Logger.log(TAG, "formatStr args =", args)
        return newStr;
    }
}
