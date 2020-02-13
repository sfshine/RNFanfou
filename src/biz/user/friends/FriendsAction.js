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
        ptrState: RefreshState.Refreshing
    }
}

function friends_refreshSuccessAction(bundle, ptrState) {
    return {
        type: "friends_refreshSuccessAction",
        bundle: bundle,
        ptrState: ptrState
    }
}

function friends_beginLoadMoreAction() {
    return {
        type: "friends_beginLoadMoreAction",
        ptrState: RefreshState.LoadingMore
    }
}

function friends_loadMoreSuccessAction(bundle, status) {
    return {
        type: "friends_loadMoreSuccessAction",
        bundle: bundle,
        ptrState: status
    }
}

function friends_loadFailAction(errorMessage) {
    return {
        type: "friends_loadFailAction",
        errorMessage: errorMessage,
        ptrState: RefreshState.Failure
    }
}
