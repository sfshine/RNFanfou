import {AsyncStorage} from 'react-native';

const KEY = 'user';

export default class UserDao {

    static fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    reject(error);
                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                }
            }).then();
        });
    }

    /**
     * 保存语言或标签
     * @param objectData
     */
    static save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(KEY, stringData, (error, result) => {

        }).then();
    }

    static clear() {
        AsyncStorage.removeItem(KEY).then();
    }
}
