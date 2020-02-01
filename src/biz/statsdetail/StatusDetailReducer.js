const initialState = {
    errorMessage: '',
};
const PREFIX = "statusDetail_"
export default function statusDetailReducer(state = initialState, action) {
    if (action.type.startsWith(PREFIX)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    }
    return state
}