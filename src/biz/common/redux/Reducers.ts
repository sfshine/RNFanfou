import {combineReducers} from 'redux';
import Logger from "../../../global/util/Logger";
import {RESET} from "../../../global/redux/ResetAction";
import themeReducer from '../../../global/theme/ThemeReducer';
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

/**
 * newState + oldState = resultState
 * @param tag
 * @param newState
 * @param oldState
 * @param defaultState
 */
export function defaultReduce(tag, newState, oldState, defaultState = {},) {
    // Logger.log(tag, "defaultReduce newState = ", newState)
    // Logger.log(tag, "defaultReduce oldState = ", oldState)
    let resultState = {}
    if (newState.type.startsWith(tag)) {
        resultState = {...oldState, ...newState};
    } else if (newState.type == RESET) {
        resultState = defaultState
    } else {
        resultState = oldState ? oldState : defaultState
    }
    // Logger.log(tag, "defaultReduce resultState = ", resultState)
    return resultState
}
