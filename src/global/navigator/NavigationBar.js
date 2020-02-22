import React, {PureComponent} from 'react';
import {DeviceInfo, Platform, StatusBar, StyleSheet, Text, View, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';
import NavigationBarViewFactory from '~/global/navigator/NavigationBarViewFactory';
import connect from 'react-redux/es/connect/connect';
import {goBackN} from './NavigationManager';
import Row from '../components/element/Row';

const NAV_BAR_HEIGHT_IOS = 44;//导航栏在iOS中的高度
export const NAV_BAR_HEIGHT_ANDROID = 44;//导航栏在Android中的高度
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;//状态栏的高度

class NavigationBar extends PureComponent {
    //提供属性的类型检查
    static propTypes = {
        title: PropTypes.string,
        titleView: PropTypes.element,
        rightButton: PropTypes.element,
        leftButton: PropTypes.element,
        backNav: PropTypes.object,
        statusBarHide: PropTypes.bool,
    };
    //设置默认属性
    static defaultProps = {};

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
                      color: styleWithTheme.textColor,
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
    },
});
const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(NavigationBar);
