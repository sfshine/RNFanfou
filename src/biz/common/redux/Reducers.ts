import {combineReducers} from 'redux';
import Logger from "../../../global/util/Logger";
import {RESET} from "../../../global/redux/ResetAction";
import themeReducer from '../../../global/theme/ThemeReducer';
import LoginReducer from "~/biz/user/login/LoginReducer";
import TimelineReducer from "~/biz/timeline/TimelineReducer";
import QuickComposeReducer from "~/biz/compose/QuickComposeReducer";
import PublicReducer from "~/biz/discovery/public/PublicReducer";
import StatusDetailReducer from "~/biz/statsdetail/StatusDetailReducer";
import SearchReducer from "~/biz/search/SearchReducer";
import FriendsReducer from "~/biz/user/friends/FriendsReducer";
import FavouriteReducer from "~/biz/user/favourite/FavouriteReducer";
import GalleryReducer from "~/biz/user/gallery/GalleryReducer";
import MentionReducer from "~/biz/compose/mention/MentionReducer";
import MessageReducer from "~/biz/message/MessageReducer";

export const rootReducer = combineReducers({
    themeReducer: themeReducer,
    LoginReducer: LoginReducer,
    TimelineReducer: TimelineReducer,
    QuickComposeReducer: QuickComposeReducer,
    PublicReducer: PublicReducer,
    StatusDetailReducer: StatusDetailReducer,
    SearchReducer: SearchReducer,
    FriendsReducer: FriendsReducer,
    FavouriteReducer: FavouriteReducer,
    GalleryReducer: GalleryReducer,
    MentionReducer: MentionReducer,
    MessageReducer: MessageReducer,
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
