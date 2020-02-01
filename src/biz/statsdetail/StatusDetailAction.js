import {statuses_context_timeline} from '../../../global/network/Api';
import FanfouFetch from "../../../global/network/FanfouFetch";
import RefreshState from "../../global/components/refresh/RefreshState";


export function refreshContextTimeline(msg_id) {
    return loadTimeline(msg_id)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
function loadTimeline(msg_id) {
    return dispatch => {
        console.log("refreshContextTimeline  msg_id", msg_id);
        dispatch(statusDetail_beginRefreshAction())
        FanfouFetch.get(statuses_context_timeline(), {id: msg_id, format: 'html'}).then((json) => {
            console.log("refreshContextTimeline json", json);
            //无论什么时候获取的数据不够一页就要显示没有更多数据了
            let endStatus = RefreshState.NoMoreData
            let newPageData = []
            let headerItem = json[0]
            for (var i = 0; i < json.length; i++) {
                var item = json[i]
                if (Date.parse(headerItem.created_at) > Date.parse(item.created_at)) {
                    headerItem = item
                }
            }
            //算法上应该可以优化
            for (var i = 0; i < json.length; i++) {
                var item = json[i]
                if (item.id !== headerItem.id) {
                    newPageData.push(item)
                }
            }
            console.log("refreshContextTimeline newPageData", newPageData);
            dispatch(statusDetail_refreshSuccessAction(msg_id, newPageData, headerItem, endStatus))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(statusDetail_loadFailAction(errorMsg));
        }).done();
    }
}

function statusDetail_beginRefreshAction() {
    return {
        type: "statusDetail_beginRefreshAction",
        loadState: RefreshState.Refreshing,
    }
}

function statusDetail_refreshSuccessAction(msg_id, pageData, headerItem, loadState) {
    return {
        type: "statusDetail_refreshSuccessAction",
        pageData: pageData,
        loadState: loadState,
        headerItem: headerItem,
        msg_id: msg_id,
    }
}

function statusDetail_loadFailAction(errorMessage) {
    return {
        type: "statusDetail_loadFailAction",
        errorMessage: errorMessage,
        loadState: RefreshState.Failure
    }
}
