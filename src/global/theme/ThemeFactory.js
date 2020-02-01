export const ThemeConfigs = {
    Default: '#2CC0C2',
    Default_Tab: '#0CA0A2',
    Red: '#F44336',
    Pink: '#E91E63',
    Purple: '#9C27B0',
    DeepPurple: '#673AB7',
    Indigo: '#3F51B5',
    Blue: '#2196F3',
    LightBlue: '#03A9F4',
    Cyan: '#00BCD4',
    Teal: '#009688',
    Green: '#03A9F4',
    LightGreen: '#8BC34A',
    Lime: '#CDDC39',
    Yellow: '#FFEB3B',
    Amber: '#FFC107',
    Orange: '#FF9800',
    DeepOrange: '#FF5722',
    Brown: '#795548',
    Grey: '#9E9E9E',
    BlueGrey: '#607D8B',
    Black: '#000000'
};

export default class ThemeFactory {
    /**
     * 这里只是改变了主题色，也可以扩展为该主题下的其他配色
     * @param primaryColor
     * @returns {{brand_primary: *, color_text_base: string}}
     */
    static createTheme(primaryColor) {
        return {
            brand_primary: primaryColor,
            color_text_base: "#FFFFFF"
        }
    }
}
