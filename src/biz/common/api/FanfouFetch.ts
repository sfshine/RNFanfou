import {FanfouModule} from '~/biz/common/api/Api';
import Logger from "~/global/util/Logger";

const TAG = "FanfouFetch"

export default class FanfouFetch {
    static get(url, params?) {
        Logger.log(TAG, 'FanfouFetch url:', url);
        Logger.log(TAG, 'FanfouFetch params:', params);
        return FanfouModule.fetch('GET', url, params, {})
            .then(response => {
                return response ? response : Promise.reject('获取数据失败: ' + response);
            }).then(response => {
                let json = JSON.parse(response)
                Logger.log(TAG, "FanfouFetch get response:", json)
                return json;
            });
    }

    static post(url, params?, fileParams?) {
        return FanfouModule.fetch('POST', url, params, fileParams)
            .then(response => {
                return response ? response : Promise.reject('操作失败: ' + response);
            }).then(response => {
                let json = JSON.parse(response)
                Logger.log(TAG, "FanfouFetch post response:", json)
                return json;
            });
    }
}
