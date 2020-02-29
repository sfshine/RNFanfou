# RNFanfou

#### 介绍
简洁易用、跨平台的饭否客户端

#### 安装教程

0.  搭建react-native编译环境
1.  git clone git@gitee.com:sfshine/RNFanfou.git
2.  yarn
3.  react-native run-android
4.  release打包方式： 

```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
npx jetify
cd android
./gradlew assembleRelease -x bundleReleaseJsAndAssets -x verifyReleaseResources
```


#### 使用说明

1.目前仅支持Android（IOS支持计划中）

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码到*develop*分支
4.  新建 Pull Request
