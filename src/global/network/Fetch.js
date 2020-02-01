import {Api} from "../../biz/common/api/Api"
import {GlobalCache} from '../AppGlobal';

export default class Fetch {
    static uploadImage(url, params) {
        return new Promise(function (resolve, reject) {
            console.log("uploadImage start")
            let formData = new FormData();
            let file = {uri: params.uri, type: 'application/octet-stream', name: 'image.jpg'};
            formData.append("file", file);
            console.log("uploadImage start2", params)
            let extParams = GlobalCache.defaultParams
            for (let key in extParams) {
                formData.append(key, extParams[key]);
            }
            console.log("uploadImage start3 url:", (Api.IMAGE_HOST + url))
            console.log("uploadImage start3 formData:", formData)

            fetch(Api.IMAGE_HOST + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data;charset=utf-8',
                },
                body: formData
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log('uploadImage', responseData);
                    resolve(responseData);
                })
                .catch((err) => {
                    // console.error(err);
                    reject(err);
                });
        });
    }

    static post(url, params) {
        return new Promise((resolve, reject) => {
            url = Api.HOST + url
            console.log("Fetch post:", url, params)
            fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: this.creteFormBody({...params, ...GlobalCache.defaultParams})
                })
                .then(response => response.json())
                .then((result) => {
                    console.log("Fetch result", result)
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    static get(url, params) {
        return new Promise((resolve, reject) => {
            url = this.createGetUrl(url, params)
            url = this.createGetUrl(url, GlobalCache.defaultParams)
            fetch(Api.HOST + url,
                {
                    method: 'GET',
                })
                .then(response => response.json())
                .then((result) => {
                    console.log("Fetch get:", url, params)
                    console.log("Fetch result", result)
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })

        })
    }

    static createGetUrl(url, params) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return url;
    }

    static creteFormBody(data) {
        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        let result = formBody.join("&");
        return result
    }


}
