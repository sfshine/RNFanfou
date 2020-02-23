Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'S': this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

let fs = require('fs');
let curDate = (new Date()).Format('yyyy-MM-dd_hh:mm:ss');
let rootPath = './app/build/outputs/apk/release/';
let cpuArch = ['armeabi-v7a', 'x86', 'arm64-v8a', 'x86_64'];
for (let arch of cpuArch) {
    fs.rename(
        `${rootPath}/app-${arch}-release.apk`,
        `${rootPath}/app-${arch}-release-${curDate}.apk`, function (err) {
            console.log(err);
        })
}

