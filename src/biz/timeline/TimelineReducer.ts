import {defaultReduce} from "~/biz/common/redux/Reducers";
import RefreshState from "~/global/components/refresh/RefreshState";
import {createResetActionWithTag} from "~/global/redux/ResetAction";

export const TAG = "TimelineReducer"
const initialState = {
    ptrState: RefreshState.Init,
    actionData: [],
};
export default function TimelineReducer(oldState, newState) {
    return defaultReduce(TAG, newState, oldState, initialState)
}

export const TIMELINE_ACTIONS = {
    Refreshing: () => {
        return {
            type: `${TAG}#Refreshing`,
            ptrState: RefreshState.Refreshing,
            // actionData: [],
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
export const ResetRedux = createResetActionWithTag(TAG, initialState)
