import {defaultReduce} from "~/biz/common/redux/Reducers"

const TAG = "GalleryReducer"

const defaultState = {}
export default function GalleryReducer(state, action) {
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
