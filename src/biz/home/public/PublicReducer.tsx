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
