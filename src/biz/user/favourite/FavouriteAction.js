import RefreshState from "../../../global/components/refresh/RefreshState";
import {loadTimeline} from '../../timeline/TimelineLoader';
import {favorites} from "../../../global/network/Api";

const actions = {
    timeline_beginRefreshAction: favourite_beginRefreshAction,
    timeline_refreshSuccessAction: favourite_refreshSuccessAction,
    timeline_beginLoadMoreAction: favourite_beginLoadMoreAction,
    timeline_loadMoreSuccessAction: favourite_loadMoreSuccessAction,
    timeline_loadFailAction: favourite_loadFailAction,
}

export function refreshTimeline(userId) {
    let initBundle = {pageIndex: 1, pageData: [], extParams: {id: userId}}
    return loadTimeline(favorites(), initBundle, actions)
}

export function loadMoreTimeline(userId, oldBundle) {
    oldBundle.pageIndex++
    return loadTimeline(favorites(), oldBundle, actions)
}

function favourite_beginRefreshAction() {
    return {
        type: "favourite_beginRefreshAction",
        ptrState: RefreshState.Refreshing,
        // pageData: {page: 1, data: []},
    }
}

function favourite_refreshSuccessAction(newBundle, ptrState) {
    return {
        type: "favourite_refreshSuccessAction",
        newBundle: newBundle,
        ptrState: ptrState
    }
}

function favourite_beginLoadMoreAction() {
    return {
        type: "favourite_beginLoadMoreAction",
        ptrState: RefreshState.LoadingMore //其实在Idle状态就展示LoadingMoreView,本状态先预留
    }
}

function favourite_loadMoreSuccessAction(newBundle, status) {
    return {
        type: "favourite_loadMoreSuccessAction",
        newBundle: newBundle,
        ptrState: status
    }
}

function favourite_loadFailAction(errorMessage) {
    return {
        type: "favourite_loadFailAction",
        errorMessage: errorMessage,
        ptrState: RefreshState.Failure
    }
}
