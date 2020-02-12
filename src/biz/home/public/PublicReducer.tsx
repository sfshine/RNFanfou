import {defaultReduce} from "../../common/redux/Reducers";

const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const PREFIX = "public_"
export default function PublicReducer(state, action) {
    return defaultReduce(PREFIX, action, state, initialState)
}
