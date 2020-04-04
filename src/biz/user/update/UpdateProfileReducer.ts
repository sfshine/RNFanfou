import {defaultReduce} from "~/biz/common/redux/Reducers"

const TAG = "UpdateProfileReducer"

const defaultState = {}
export default function UpdateProfileReducer(state, action) {
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
