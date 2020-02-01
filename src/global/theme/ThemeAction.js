import {ACTIONS} from "./ThemeReducer";
import AsyncStorage from "@react-native-community/async-storage"
import ThemeFactory, {ThemeConfigs} from "./ThemeFactory";

const THEME_KEY = 'theme_key'

/**
 * 初始化主题
 * @returns {Function}
 */
export function onThemeInit() {
    return dispatch => {
        AsyncStorage.getItem(THEME_KEY).then(themeConfig => {
            console.log("onThemeInit success,", themeConfig)
            if (!themeConfig) {
                themeConfig = ThemeConfigs.Default;
                saveTheme(themeConfig);
            }
            dispatch(ACTIONS.onThemeChange(ThemeFactory.createTheme(themeConfig)))
        }).catch(e => {
            console.error("onThemeInit failed", e)
        })
    }
}

/**
 * 保存主题标识
 * @param themeFlag
 */
function saveTheme(themeConfig) {
    AsyncStorage.setItem(THEME_KEY, themeConfig).catch(e => {
        console.error("save themeFlag failed", e)
    })
}