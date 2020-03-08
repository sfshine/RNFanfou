import {defaultReduce} from "~/biz/common/redux/Reducers";
import {createResetActionWithTag} from "~/global/redux/ResetAction";

const initialState = {
    pageList: [],
};
const TAG = "public_"
export default function PublicReducer(state, action) {
    return defaultReduce(TAG, action, state, initialState)
}
export const ResetRedux = createResetActionWithTag(TAG, initialState)
