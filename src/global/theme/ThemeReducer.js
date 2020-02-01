import ThemeFactory, {ThemeConfigs} from "./ThemeFactory";
import {RESET} from "../redux/ResetAction";

const PREFIX = "THEME_"

const defaultState = {
    theme: ThemeFactory.createTheme(ThemeConfigs.Default),
    onShowCustomThemeView: false,
};
export default function themeReducer(state = defaultState, action) {
    if (action.type.startsWith(PREFIX)) {
        console.log(action.type, action);
        return {
            ...state,
            ...action
        };
    } else if (action.type == RESET) {
        return defaultState
    }
    return state
}


export const TYPES = {
    THEME_CHANGE: PREFIX + "CHANGE",
}
export const ACTIONS = {
    onThemeChange: (theme) => {
        return {type: TYPES.THEME_CHANGE, theme: theme}
    }
}
