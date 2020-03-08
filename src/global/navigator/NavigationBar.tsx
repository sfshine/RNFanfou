import React, {PureComponent} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import NavigationBarViewFactory from '~/global/navigator/NavigationBarViewFactory';
import connect from 'react-redux/es/connect/connect';
import {goBackN} from './NavigationManager';
import Row from '../components/element/Row';
import BaseProps from "~/global/base/BaseProps";

const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
export const NAV_BAR_HEIGHT_ANDROID = 44;//导航栏在Android中的高度
// const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;//状态栏的高度
const STATUS_BAR_HEIGHT = 20;//状态栏的高度

interface Props extends BaseProps {
    titleView: any,
    title: any,
    leftButton: any,
    rightButton: any,
    backNav: any,
    statusBarHide: boolean,
}

class NavigationBar extends PureComponent<Props> {
    render() {
        let theme = this.props.theme;
        let styleWithTheme = {
            backgroundColor: theme.brand_primary,
            textColor: theme.color_text_base,
        };
        return (
            this.createNavigationBarWithTheme(styleWithTheme)
        );
    }

    createNavigationBarWithTheme = (styleWithTheme) => {
        console.log('styleWithTheme', styleWithTheme);
        return <View style={styles.navBarWithStatusBarShape}>
            {this.initStatusBar(styleWithTheme)}
            {this.initNav(styleWithTheme)}
        </View>;
    };

    initNav = (styleWithTheme) => {
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="tail" numberOfLines={1}
                  style={[styles.title, {
                      color: styleWithTheme.textColor
                  }]}>{this.props.title}</Text>;
        let content = <View style={[styles.navBarShape, {backgroundColor: styleWithTheme.backgroundColor}]}>
            <Row>
                {this.props.leftButton ? this.props.leftButton : this.getDefaultLeftButton(this.props.backNav)}
                {titleView}
            </Row>
            {this.props.rightButton ? this.props.rightButton : <View style={{width: 40}}/>}
        </View>;
        return content;
    };

    getDefaultLeftButton(backNav) {
        return backNav ? NavigationBarViewFactory.createButton({
            icon: 'arrowleft',
            callback: () => goBackN(backNav),
        }) : <View style={{width: 10}}/>;
    }

    initStatusBar = (styleWithTheme) => {
        let statusBarCfg = {
            height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
            backgroundColor: styleWithTheme.backgroundColor,
            barStyle: 'light-content',
            animated: true,
        };
        // @ts-ignore
        let statusBar = this.props.statusBarHide ? null : <StatusBar {...statusBarCfg} />;
        return statusBar;
    };


}

const styles = StyleSheet.create({
    navBarWithStatusBarShape: {
        flexDirection: 'column',
    },
    navBarShape: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        width: "80%",
    },
});
const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(NavigationBar);
