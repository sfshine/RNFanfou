import {combineReducers} from 'redux';
import Logger from "../../../global/util/Logger";
import {RESET} from "../../../global/redux/ResetAction";
import homeReducer from "../../test/main/home/HomeReducer";
import themeReducer from '../../../global/theme/ThemeReducer';
import $FunNameReducer from "../../test/ideaplugin/$FunNameReducer";
import DetailReducer from "~/biz/test/detail/DetailReducer";

export const rootReducer = combineReducers({
    themeReducer: themeReducer,
    $FunNameReducer: $FunNameReducer,
    homeReducer: homeReducer,
    DetailReducer: DetailReducer,
});

export function defaultReduce(tag, action, state, defaultState = {},) {
    Logger.log(tag, "defaultReduce action = ", action)
    Logger.log(tag, "defaultReduce state = ", state)
    let resultState = {}
    if (action.type.startsWith(tag)) {
        resultState = {...state, ...action};
    } else if (action.type == RESET) {
        resultState = defaultState
    } else {
        resultState = state ? state : defaultState
    }
    Logger.log(tag, "defaultReduce resultState = ", resultState)
    return resultState
}
