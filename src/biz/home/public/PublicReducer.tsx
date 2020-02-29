import {defaultReduce} from "../../common/redux/Reducers";
import RefreshState from "~/global/components/refresh/RefreshState";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const TAG = "public_"
export default function PublicReducer(state, action) {
    return defaultReduce(TAG, action, state, initialState)
}
export const PUBLIC_ACTIONS = {
    Refreshing: () => {
        return {
            type: `${TAG}#Refreshing`,
            ptrState: RefreshState.Refreshing,
        }
    },
    Idle: (pageData) => {
        return {
            type: `${TAG}#Idle`,
            pageData: pageData,
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
    LoadingMoreEnd: (pageData) => {
        return {
            type: `${TAG}#LoadingMoreEnd`,
            pageData: pageData,
            ptrState: RefreshState.LoadingMoreEnd,
        }
    },
    LoadingMoreError: () => {
        return {
            type: `${TAG}#LoadingMoreError`,
            ptrState: RefreshState.LoadingMoreError,
        }
    },
    SEARCH_CANCEL: () => {
        return {
            type: `${TAG}#SEARCH_CANCEL`,
            pageData: null,
            ptrState: RefreshState.Idle,
        }
    },
    SearchesListSuccess: (json) => {
        return {
            type: `${TAG}#search_searches_list_success`,
            search_searches_list: json
        }
    },
    SearchListFail: (err) => {
        return {
            type: `${TAG}#search_searches_list_success`,
            errorMessage: err,
        }
    }
}
