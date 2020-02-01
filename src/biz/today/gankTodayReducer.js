import * as types from '../../global/constants/ActionTypes';

const initState = {
  loading: false,
  errorMessage:'',
  isSuccess:false,
  data: []
};

export default function gankToday(state=initState, action) {
  switch (action.type) {
    case types.GET_TODAY_LOADING:
      return {
        ...state,
        loading: true,
        isSuccess:false,
        data: [],
      };
    case types.GET_TODAY_SUCCESS:
      return {
        ...state,
        loading: false,
        isSuccess:true,
        data: action.data
      };
    case types.GET_TODAY_FAIL:
      return {
        ...state,
        loading: false,
        isSuccess: false,
        data: [],
        errorMessage:action.errorMessage
      };
    default:
      return state;
  }
}