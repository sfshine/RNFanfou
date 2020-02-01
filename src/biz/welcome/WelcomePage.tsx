import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import * as themeAction from '~/global/theme/ThemeAction';
import {StyleSheet} from 'react-native'
import {navigateResetN} from "~/global/navigator/NavigationManager";
import SplashScreen from "react-native-splash-screen";
import Logger from "~/global/util/Logger"
import LoginAction from "~/biz/user/login/LoginAction";

const image = [
    require("#1.png"),
    require("#2.png"),
    require("#3.png"),
]

interface Props {
    navigation: object;
    onThemeInit: Function;
}

const TAG = "WelcomePage"

class WelcomePage extends PureComponent<Props, {}> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Logger.log(TAG, "componentWillMount", this.props);
        SplashScreen.hide()
        this.init().then()
    }


    componentWillUnmount() {
        Logger.log(TAG, "componentWillUnmount");
    }

    render() {
        return null
    }

    private async init() {
        this.props.onThemeInit();
        this.toMain();
    }
F
    private toMain() {
        LoginAction.checkLogin(hasLogin => {
            if (hasLogin) {
                navigateResetN(this.props.navigation, "MainPage");
            } else {
                navigateResetN(this.props.navigation, "LoginPage")
            }
        })
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        onThemeInit: () => dispatch(themeAction.onThemeInit()),
    })
)(WelcomePage)

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    image: {
        width: "100%",
        height: "100%",
    }
})
