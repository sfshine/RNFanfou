const initialState = {
    loading: false,
    errorMessage: '',
    isSuccess: false,
    hasLogin: false,
};
const PREFIX = "friends_"
export default function friendsReducer(state = initialState, action) {
    if (action.type.startsWith(PREFIX)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    }
    return state
}
