import RefreshState from "~/global/components/refresh/RefreshState";
import {defaultReduce} from "~/biz/common/redux/Reducers";
import {createResetActionWithTag} from "~/global/redux/ResetAction";

const initialState = {
    actionData: [],
    ptrState: RefreshState.Idle,
};
const TAG = "MentionReducer"
export default function MentionReducer(state = initialState, action) {
    return defaultReduce(TAG, action, state, initialState)
}

export const MENTION_ACTIONS = {
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
    ResetRedux: createResetActionWithTag(TAG, initialState)
}
