import {defaultReduce} from "~/biz/common/redux/Reducers";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const PREFIX = "search_"
export default function SearchReducer(state, action) {
    return defaultReduce(PREFIX, action, state, initialState)
}
