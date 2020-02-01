import {PermissionsAndroid} from 'react-native';
//TODO 重构为Promise
export function requestPermission(success, fail) {
    const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ]
    PermissionsAndroid.requestMultiple(permissions, {
            title: '申请权限',
            message: '需要读写存储器和拍照权限',
            buttonNeutral: '下次提醒',
            buttonNegative: '取消',
            buttonPositive: '确定',
        },
    ).then(grantResult => {
        console.log("requestPermission grantResult:", grantResult)
        let allGranted = true
        for (let i = 0; i < permissions.length; i++) {
            console.log("grantResult[permissions[i]]:", grantResult[permissions[i]])
            if (grantResult[permissions[i]] != "granted") {
                console.log("not granted:", permissions[i])
                allGranted = false
                break
            }
        }
        console.log("allGranted:", allGranted)
        if (allGranted)
            success("权限请求成功")
        else
            fail("用户拒绝了授权请求,请在系统设置中开启权限")
    }).catch(err => {
        fail("用户拒绝了授权请求,请在系统设置中开启权限" + err)
    });
}
