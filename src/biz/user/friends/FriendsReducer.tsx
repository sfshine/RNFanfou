import RefreshState from "~/global/components/refresh/RefreshState";
import {defaultReduce} from "~/biz/common/redux/Reducers";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const TAG = "friends_"
export default function FriendsReducer(state = initialState, action) {
    return defaultReduce(TAG, action, state, initialState)
}

export const FRIENDS_ACTIONS = {
    Refreshing: () => {
        return {
            type: `${TAG}#Refreshing`,
            ptrState: RefreshState.Refreshing,
            actionData: [],
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
