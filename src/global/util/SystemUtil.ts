import {PermissionsAndroid} from 'react-native';

export function requestPermission() {
    const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];
    return new Promise((resolve, reject) => {
        PermissionsAndroid.requestMultiple(permissions,
        ).then(grantResult => {
            console.log('requestPermission grantResult:', grantResult);
            let allGranted = true;
            for (let i = 0; i < permissions.length; i++) {
                console.log('grantResult[permissions[i]]:', grantResult[permissions[i]]);
                if (grantResult[permissions[i]] != 'granted') {
                    console.log('not granted:', permissions[i]);
                    allGranted = false;
                    break;
                }
            }
            console.log('allGranted:', allGranted);
            if (allGranted) {
                resolve('权限请求成功');
            } else {
                reject('用户拒绝了授权请求,请在系统设置中开启权限');
            }
        }).catch(err => {
            reject('用户拒绝了授权请求,请在系统设置中开启权限' + err);
        });
    });
}
