import RefreshState from "~/global/components/refresh/RefreshState";
import {createResetActionWithTag} from "~/global/redux/ResetAction";

const initialState = {
    actionData: []
};
const TAG = "FavouriteReducer"
export default function FavouriteReducer(state = initialState, action) {
    if (action.type.startsWith(TAG)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    }
    return state
}

export const FAV_ACTIONS = {
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
export const ResetRedux = createResetActionWithTag(TAG, initialState)
