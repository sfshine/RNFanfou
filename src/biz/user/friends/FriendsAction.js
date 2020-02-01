import {statuses_followers} from '../../../global/network/Api';
import FanfouFetch from "../../../global/network/FanfouFetch";
import RefreshState from "../../../global/components/refresh/RefreshState";

const actions = {
    beginRefreshAction: friends_beginRefreshAction,
    refreshSuccessAction: friends_refreshSuccessAction,
    beginLoadMoreAction: friends_beginLoadMoreAction,
    loadMoreSuccessAction: friends_loadMoreSuccessAction,
    loadFailAction: friends_loadFailAction,
}

export function refreshFriends(id) {
    return FanfouFetch.pageGet(statuses_followers(), {pageIndex: 1, data: []}, {id: id}, actions)
}

export function loadMoreFriends(id, oldBundle) {
    let nextBundle = {pageIndex: oldBundle.pageIndex + 1, data: oldBundle.data}
    return FanfouFetch.pageGet(statuses_followers(), nextBundle, {id: id}, actions)
}

function friends_beginRefreshAction() {
    return {
        type: "friends_beginRefreshAction",
        loadState: RefreshState.Refreshing
    }
}

function friends_refreshSuccessAction(bundle, loadState) {
    return {
        type: "friends_refreshSuccessAction",
        bundle: bundle,
        loadState: loadState
    }
}

function friends_beginLoadMoreAction() {
    return {
        type: "friends_beginLoadMoreAction",
        loadState: RefreshState.LoadingMore
    }
}

function friends_loadMoreSuccessAction(bundle, status) {
    return {
        type: "friends_loadMoreSuccessAction",
        bundle: bundle,
        loadState: status
    }
}

function friends_loadFailAction(errorMessage) {
    return {
        type: "friends_loadFailAction",
        errorMessage: errorMessage,
        loadState: RefreshState.Failure
    }
}
