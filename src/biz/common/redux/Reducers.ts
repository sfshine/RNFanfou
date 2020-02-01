import {combineReducers} from 'redux';
import Logger from "../../../global/util/Logger";
import {RESET} from "../../../global/redux/ResetAction";
import themeReducer from '../../../global/theme/ThemeReducer';
import LoginReducer from "~/biz/user/login/LoginReducer";
import timelineReducer from "~/biz/timeline/TimelineReducer";
import TimelineReducer from "~/biz/timeline/TimelineReducer";

export const rootReducer = combineReducers({
    themeReducer: themeReducer,
    LoginReducer: LoginReducer,
    TimelineReducer:TimelineReducer,
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
