import {defaultReduce} from "~/biz/common/redux/Reducers";

const initialState = {
    errorMessage: '',
};
const PREFIX = "statusDetail_"
export default function StatusDetailReducer(state, action) {
    return defaultReduce(PREFIX, action, state, initialState)
}
