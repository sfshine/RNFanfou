import RefreshState from "../../global/components/refresh/RefreshState";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import {goBack, goBackN, navigateN} from "~/global/navigator/NavigationManager";

const TAG = "StatusDetailAction"

export default class StatusDetailAction {
    static unLoadStatusCache() {
        return dispatch => {
            dispatch(statusDetail_unLoadStatusDetailCacheAction())
        }
    }

    static loadStatusContextTimeline(status) {
        return dispatch => {
            Logger.log(TAG, "refreshContextTimeline  status", status);
            // dispatch(statusDetail_beginRefreshAction())
            FanfouFetch.get(Api.statuses_context_timeline, {id: status.id, format: 'html'}).then((json) => {
                Logger.log(TAG, "refreshContextTimeline json", json);
                let endStatus = RefreshState.LoadingMoreEnd
                let newPageData = []
                let headerStatus = status
                for (let i = 0; i < json.length; i++) {
                    let item = json[i]
                    if (Date.parse(headerStatus.created_at) > Date.parse(item.created_at)) {
                        headerStatus = item
                    }
                }
                Logger.log(TAG, "headerStatus", headerStatus)
                //算法上应该可以优化
                for (var i = 0; i < json.length; i++) {
                    var item = json[i]
                    if (item.rawid != headerStatus.rawid) {
                        newPageData.push(item)
                    }
                }
                Logger.log(TAG, "refreshContextTimeline newPageData", newPageData);
                dispatch(statusDetail_refreshSuccessAction(status.id, newPageData, headerStatus, endStatus))
            }).catch((e) => {
                Logger.log(TAG, e);
                let errorMsg = "加载失败";
                dispatch(statusDetail_loadFailAction(errorMsg));
            }).done();
        }
    }

    static statuses_destroy(id, callback) {
        let loading = TipsUtil.toastLoading('删除中...');
        FanfouFetch.post(Api.statuses_destroy, {id: id}).then(json => {
            if (json) {
                TipsUtil.toastSuccess('删除成功', loading);
                callback && callback()
            } else {
                TipsUtil.toastFail('删除失败', loading);
            }
        }).catch(e => {
            TipsUtil.toastFail('删除失败' + e.toString(), loading);
        });
    }
}

function statusDetail_beginRefreshAction() {
    return {
        type: "statusDetail_beginRefreshAction",
        ptrState: RefreshState.Refreshing,
    }
}

function statusDetail_unLoadStatusDetailCacheAction() {
    return {
        type: "statusDetail_unLoadStatusDetailCacheAction",
        ptrState: RefreshState.Idle,
        pageData: [],
        headerStatus: null,
        msg_id: "",
    }
}

function statusDetail_refreshSuccessAction(msg_id, pageData, headerStatus, ptrState) {
    return {
        type: "statusDetail_refreshSuccessAction",
        pageData: pageData,
        ptrState: ptrState,
        headerStatus: headerStatus,
        msg_id: msg_id,
    }
}

function statusDetail_loadFailAction(errorMessage) {
    return {
        type: "statusDetail_loadFailAction",
        errorMessage: errorMessage,
        ptrState: RefreshState.LoadingMoreError
    }
}
