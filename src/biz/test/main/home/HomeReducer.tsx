import {defaultReduce} from "~/biz/common/redux/Reducers"
import RefreshState from "~/global/components/refresh/RefreshState";

const TAG = "HomeReducer"

const defaultState = {}
export default function homeReducer(state, action) {
    return defaultReduce(TAG, action, state, defaultState)
}

export const ACTIONS = {
    Refreshing: () => {
        return {
            type: `${TAG}#Refreshing`,
            ptrState: RefreshState.Refreshing,
        }
    },
    Idle: (actionData) => {
        return {
            type: `${TAG}#Idle`,
            actionData: actionData,
            ptrState: RefreshState.Idle,
        }
    },
    RefreshingFailed: () => {
        return {
            type: `${TAG}#RefreshingFailed`,
            ptrState: RefreshState.Idle,
        }
    },
    LoadingMore: () => {
        return {
            type: `${TAG}#LoadingMore`,
            ptrState: RefreshState.LoadingMore,

        }
    },
    LoadingMoreEnd: (actionData) => {
        return {
            type: `${TAG}#LoadingMoreEnd`,
            actionData: actionData,
            ptrState: RefreshState.LoadingMoreEnd,
        }
    },
    LoadingMoreError: () => {
        return {
            type: `${TAG}#LoadingMoreError`,
            ptrState: RefreshState.LoadingMoreError,
        }
    },
}
