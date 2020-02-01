import {defaultReduce} from "~/biz/common/redux/Reducers"

const TAG = "$FunNameReducer"

const defaultState = {}
export default function $FunNameReducer(state, action) {
    return defaultReduce(TAG, action, state, defaultState)
}

export const ACTIONS = {
    success: (actionData) => {
        return {
            type: TAG + "#SUCCESS",
            actionData: actionData,
        }
    },
    failed: () => {
        return {
            type: TAG + "#FAILED",
        }
    }
}
