export class FanfouUtil {
    static isProfileUrl(url) {
        return url.startsWith("http://fanfou.com/") || url.startsWith("https://fanfou.com/")
    }
}
