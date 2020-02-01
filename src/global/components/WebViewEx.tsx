import React from "react";
import {WebView, WebViewSource, WebViewSourceHtml, WebViewSourceUri} from "react-native-webview";
import {StyleSheet, View} from "react-native";
import {goBackN, navigateN} from "../navigator/NavigationManager";
import {GlobalCache} from "../AppGlobal";
import Logger from "~/global/util/Logger";

interface Props {
    url: string;
    navigation: object;
    onNavigationStateChange: Function;
}

const TAG = "WebViewEx"
const EXT_NEW_PAGE = "https://new_page/?url=";
const EXT_CLOSE_PAGE = "https://close_page";

export default class WebViewEx extends React.PureComponent<Props, {}> {
    private mGlobalParams = "token=" + GlobalCache.user.token
    private mWebView: WebView

    onShouldStartLoadWithRequest = (navState) => {
        let {onNavigationStateChange, navigation} = this.props;
        Logger.log(TAG, " navState:", navState)
        let jumpUrl = navState.url;
        if (jumpUrl.startsWith(EXT_NEW_PAGE)) {
            let realUrl = decodeURIComponent(jumpUrl.replace(EXT_NEW_PAGE, ""));
            Logger.log(TAG, "open new window for url:", realUrl)
            navigateN(navigation, "WebViewScreen", {
                url: realUrl
            })
        } else if (jumpUrl.startsWith(EXT_CLOSE_PAGE)) {
            Logger.log(TAG, "close this window because url:", jumpUrl)
            goBackN(navigation)
        } else if (onNavigationStateChange) {
            Logger.log(TAG, "process url by default:", jumpUrl)
            onNavigationStateChange(navState)
        }
        return false;
    }

    render() {
        Logger.log(TAG, "will open source:", this.props.url)
        let url = this.appendGlobalParamsIfNeeded(this.props.url)
        Logger.log(TAG, "appendGlobalParamsIfNeeded:", url)
        if (!url) {
            return null
        } else {
            return <View style={styles.webViewContainer}>
                <WebView onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                         onNavigationStateChange={this.onShouldStartLoadWithRequest} //for Android
                         startInLoadingState={true}
                         ref={webView => this.mWebView = webView}
                         source={{uri: url, method: 'GET'}}/>
            </View>
        }
    }

    private appendGlobalParamsIfNeeded(url) {
        return url.indexOf(this.mGlobalParams) > 0 ? url : `${url}?&${this.mGlobalParams}`
    }

    goBack() {
        this.mWebView?.goBack()
    }
}
const styles = StyleSheet.create({
    webViewContainer: {
        overflow: 'hidden',
        flex: 1,
    }
});
