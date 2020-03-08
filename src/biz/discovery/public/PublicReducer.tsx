import {defaultReduce} from "~/biz/common/redux/Reducers";

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
