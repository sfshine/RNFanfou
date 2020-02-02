import {defaultReduce} from "~/biz/common/redux/Reducers";

const defaultState = {}
const TAG = "QuickComposeReducer"

export default function QuickComposeReducer(state = defaultState, action) {
    return defaultReduce(TAG, action, state, defaultState)
}
export const ACTIONS = {
}
