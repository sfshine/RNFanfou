import {PermissionsAndroid} from 'react-native';
import {init, Geolocation, setNeedAddress, setLocatingWithReGeocode} from "react-native-amap-geolocation";

export const getLocation = async (success, failed) => {
    try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        await init({
            ios: "7074d5650149669767eca626b2d5f2f5",
            android: "7074d5650149669767eca626b2d5f2f5"
        });
        setNeedAddress(true);
        setLocatingWithReGeocode(true);
        Geolocation.getCurrentPosition(
            ({location}) => {
                console.log("getLocation result", location)
                success(location)
            });
    } catch (e) {
        console.warn("getLocation", e)
        failed(e)
    }
}