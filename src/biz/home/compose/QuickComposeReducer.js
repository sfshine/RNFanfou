defaultState = {}
const PREFIX = "quickCompose_"
export default function quickComposeReducer(state = defaultState, action) {
    if (action.type.startsWith(PREFIX)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    }
    else return state
}