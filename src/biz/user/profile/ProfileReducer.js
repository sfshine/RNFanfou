const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const PREFIX = "profile_"
export default function profileReducer(state = initialState, action) {
    if (action.type.startsWith(PREFIX)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    }
    else return state
}