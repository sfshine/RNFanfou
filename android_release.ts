const util = require("./build_script/util.ts");
const fs = require('fs');

const apkPath = './android/app/build/outputs/apk/release/';
const cpuArch = ['armeabi-v7a', 'x86', 'arm64-v8a', 'x86_64'];

const cmdRN = [
    // "pwd",
    // "git checkout develop",
    // "git pull",
    // "git status",
    "rm  -rf ./android/app/build/outputs/apk/release/*.apk",
    "yarn",
    "react-native link",
    "rm -rf android/app/src/main/assets/index.android.bundle",
    "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/",
    "npx jetify",
]

const cmdAndroid = [
    // "export JAVA_OPTS=\"-Xmx1024M -XX:MaxPermSize=512M -XX:ReservedCodeCacheSize=512M\"",
    // "export GRADLE_OPTS=\"-Dorg.gradle.daemon=false\"",
    // "./gradlew clean",
    "./gradlew assembleRelease -x bundleReleaseJsAndAssets -x verifyReleaseResources",
    // "node ./rename-apk.js"
]
console.log("start>>>>")
//1 打包RN bundle
util.execSyncCmdsAndPrint(cmdRN, "./")
//2 打包apk
util.execSyncCmdsAndPrint(cmdAndroid, "./android/")
//3 重命名Apk
let curDate = util.formatDate(new Date(), 'yyyy-MM-dd_hh:mm:ss')
for (let arch of cpuArch) {
    fs.rename(
        `${apkPath}/app-${arch}-release.apk`,
        `${apkPath}/app-${arch}-release-${curDate}.apk`, function (err) {
            console.log(err);
        })
}

