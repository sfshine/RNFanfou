import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "~/global/navigator/NavigationBar";
import SafeAreaViewPlus from "~/global/components/SafeAreaViewPlus";
import WebViewEx from "~/global/components/WebViewEx";
import Logger from "~/global/util/Logger";
import {goBack} from "~/global/navigator/NavigationManager";
import {WebView} from "react-native-webview";

const TAG = "WebPage"

interface Props {
    navigation: any;
}

//from WebViewNativeEvent
interface State {
    url: string;
    title: string;
    canGoBack: boolean;
}

class WebPage extends PureComponent<Props, State> {
    private mWebViewEx: WebViewEx

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        Logger.log(TAG, "params:", params)
        this.state = {
            title: params.title ? params.title : "打开网页",
            url: params.url,
            canGoBack: false,
        };
    }

    onNavigationStateChange = (navState) => {
        this.setState(navState)
    }

    render() {
        let navigationBar = <NavigationBar title={this.state.title} backNav={this.props.navigation}/>;
        return (
            <SafeAreaViewPlus backPress={this.overrideBackPress}>
                {navigationBar}
                <View style={styles.container}>
                    <WebViewEx
                        navigation={this.props.navigation}
                        onNavigationStateChange={this.onNavigationStateChange}
                        url={this.state.url}
                        ref={webView => this.mWebViewEx = webView}
                    />
                </View>
            </SafeAreaViewPlus>
        );
    }

    overrideBackPress = () => {
        if (this.state.canGoBack) {
            this.mWebViewEx?.goBack()
        } else {
            goBack(this.props)
        }
        return true
    }
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flex: 1
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme
    }),
    (dispatch) => ({})
)(WebPage)
