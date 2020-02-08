import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "~/global/navigator/NavigationBar";
import SafeAreaViewPlus from "~/global/components/SafeAreaViewPlus";
import NavigationBarViewFactory, {ButtonConfig} from "~/global/navigator/NavigationBarViewFactory";

interface Props {
    title?: string;
    backNav?: object;
    overrideBackPress: Function;
    overrideNavBar: object;
    rightNavButtonConfig: ButtonConfig | ButtonConfig[];
}

class PageCmpt extends React.PureComponent<Props, {}> {
    render() {
        /**
         * 返回键的处理：
         * backNav:传入二级页面的navigation，以便进行back键的响应
         * overrideBackPress：页面自定义返回键处理，优先级高于backNav
         *
         *　导航的处理
         *  title:　
         *  overrideNavBar：用户自定义的导航栏，优先级高于title
         */
        let {title, backNav, overrideBackPress, overrideNavBar, rightNavButtonConfig, children} = this.props;
        return <SafeAreaViewPlus style={styles.container}
                                 backNav={backNav}
                                 backPress={overrideBackPress}>
            {overrideNavBar ? overrideNavBar : (title && this.renderNavBar(title, backNav, rightNavButtonConfig))}
            {children}
        </SafeAreaViewPlus>
    }

    renderNavBar(title, backNav, rightNavButtonConfig) {
        return <NavigationBar title={title} backNav={backNav}
                              rightButton={this.renderRightNavButtons(rightNavButtonConfig)}
        />
    }

    renderRightNavButtons(rightNavButtonConfig) {
        if (rightNavButtonConfig == null) return null
        if (rightNavButtonConfig instanceof Array) {
            return NavigationBarViewFactory.createButtonGroups(rightNavButtonConfig)
        } else {
            return NavigationBarViewFactory.createButton(rightNavButtonConfig)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }), null
)(PageCmpt)
