import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import RefreshState from "~/global/components/refresh/RefreshState";

export function refreshTimeline(oldPageList) {
    return loadPublicTimeline(oldPageList)
}

/**
 * 刷新, paging 传入{page:1, data:{}}, load more传入 {page:>1, data: data进行追加}
 * @param paging
 * @returns {Function}
 */
const COUNT = 100;

function loadPublicTimeline(oldPageList) {
    return dispatch => {
        dispatch(public_beginRefreshAction())
        FanfouFetch.get(Api.statuses_public_timeline, {msg_count: COUNT, format: 'html'}).then((json) => {
            console.log("loadPublicTimeline json", json);
            let newPageList = mergeData(oldPageList, json)
            console.log("loadPublicTimeline newPageList", newPageList);
            dispatch(public_refreshSuccessAction(newPageList))
        }).catch((e) => {
            console.log(e);
            let errorMsg = "加载失败";
            dispatch(public_loadFailAction(errorMsg));
        }).done();
    }
}

//将oldPageData头部数据和json尾部数据拼接,如果从json找不到headData,就完全拼接
function mergeData(oldPageList, json) {
    console.log("mergeData start json = ", json)
    console.log("mergeData start oldPageList = ", oldPageList)
    if (!json || json.length < 1) {
        console.warn("json is empty " + json.length)
        return oldPageList
    }
    if (!oldPageList || oldPageList.length < 1) {
        console.log("oldPageList is empty " + oldPageList.length)
        return json
    }
    let headData = oldPageList[0]
    let index = json.length
    console.log("mergeData for loop ")
    for (var i = index - 1; i > -1; i--) {
        console.log("mergeData for loop  headData.id = " + headData.id + " json.id=" + json[i].id)
        if (headData.id === json[i].id) {
            index = i
            break
        }
    }
    console.log("mergeData index  " + index)
    let newData = [...json.slice(0, index), ...oldPageList]
    if (newData.length > 100) {
        newData = newData.slice(0, 101)//前闭后开 前100条
    }
    return newData
}

function public_beginRefreshAction() {
    return {
        type: "public_beginRefreshAction",
        ptrState: RefreshState.Refreshing
    }
}

function public_refreshSuccessAction(pageList) {
    return {
        type: "public_refreshSuccessAction",
        pageList: pageList,
        ptrState: RefreshState.Idle
    }
}

function public_loadFailAction(errorMessage) {
    return {
        type: "public_loadFailAction",
        errorMessage: errorMessage,
        ptrState: RefreshState.LoadingMoreError
    }
}
