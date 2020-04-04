import {PermissionsAndroid} from 'react-native';
import {init, Geolocation, setNeedAddress, setLocatingWithReGeocode} from "react-native-amap-geolocation";
import Logger from "~/global/util/Logger";

const TAG = "LocationUtil"
export const getLocation = async (success, failed) => {
    try {
        Logger.log(TAG, "getLocation start")
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        await init({
            ios: "",
            android: "635f6b7a63b6a6101f2e54d2df24d8a9"
        });
        setNeedAddress(true);
        setLocatingWithReGeocode(true);
        Geolocation.getCurrentPosition(
            ({location}) => {
                Logger.log(TAG, "getLocation result", location)
                success(location)
            });
    } catch (e) {
        Logger.warn(TAG, "getLocation", e)
        failed(e)
    }
}
