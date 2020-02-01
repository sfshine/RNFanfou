import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import * as themeAction from '~/global/theme/ThemeAction';
import Swiper from 'react-native-swiper'
import {AsyncStorage, Image, StyleSheet, View} from 'react-native'
import {navigateReset} from "~/global/navigator/NavigationManager";
import SplashScreen from "react-native-splash-screen";
import Button from "@ant-design/react-native/lib/button";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger"

const image = [
    require("#1.png"),
    require("#2.png"),
    require("#3.png"),
]

interface Props {
    navigation: object;
    onThemeInit: Function;
}

interface State {
    showSwiper: boolean
}

class WelcomePage extends PureComponent<Props, State> {
    public state = {
        showSwiper: false,
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("WelcomeScreen:componentWillMount", this.props);
        SplashScreen.hide()
        this.init().then()
    }


    componentWillUnmount() {
        console.log("WelcomeScreen:componentWillUnmount");
        // this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            this.state.showSwiper ? <Swiper loop={false}>
                    <Image style={styles.image} source={image[0]}/>
                    <Image style={styles.image} source={image[1]}/>
                    <View>
                        <Image style={styles.image} source={image[2]}/>
                        <Button style={{
                            position: 'absolute',
                            alignSelf: "center",
                            marginBottom: 20,
                            width: "70%",
                            bottom: 20,
                            borderColor: "white",
                            borderWidth: 0.7
                        }}
                                type={"primary"}
                                onPress={() => {
                                    AsyncStorage.setItem("showSwiper", "false").then()
                                    navigateReset(this.props, "TestMainPage");
                                }}>开始
                        </Button>
                    </View>
                </Swiper>
                : null
        )
    }

    private async init() {
        this.props.onThemeInit();

        let result = await AsyncStorage.getItem("showSwiper");
        if (result === "false") {
            this.toMain();
        } else {
            this.setState({showSwiper: true})
        }

        let apiEnv = await AsyncStorage.getItem("apiEnv")
        if (apiEnv) {
            Api.HOST = apiEnv
        }
        Logger.log("showSwiper", result)
        Logger.log("apiEnv", Api.HOST)
    }

    private toMain() {
        navigateReset(this.props, "TestMainPage");
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
