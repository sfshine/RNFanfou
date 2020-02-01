import {AsyncStorage} from 'react-native';

export class ConfigUtil {
    public static async get<T>(key: string, deft: T): Promise<T> {
        let retrieveData: T = null;
        let value: string;
        try {
            value = await AsyncStorage.getItem(key);
        } catch (e) {
            value = null;
        }
        if (value) {
            retrieveData = JSON.parse(value);
            return retrieveData;
        } else {
            return deft;
        }
    }

    public static set<T>(key: string, value: T): Promise<void> {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    public static delete(key: string): Promise<void> {
        return AsyncStorage.removeItem(key);
    }
}
