import {defaultReduce} from "~/biz/common/redux/Reducers";

const defaultState = {}
const PREFIX = "QuickComposeReducer"

export default function QuickComposeReducer(state = defaultState, action) {
    return defaultReduce(PREFIX, action, state, defaultState)
}
