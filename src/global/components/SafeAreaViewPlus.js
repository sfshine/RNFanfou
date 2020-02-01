import React, {PureComponent,} from 'react';
import {DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';
import BackPressComponent from "./BackPressComponent";
import {goBackN} from "../navigator/NavigationManager";

/**
 * 适配IphoneX
 */
export default class SafeAreaViewPlus extends PureComponent {
    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,
        bottomColor: PropTypes.string,
        enablePlus: PropTypes.bool,
        topInset: PropTypes.bool,
        bottomInset: PropTypes.bool,
        backNav: PropTypes.object,
    };
    static defaultProps = {
        topColor: 'transparent',
        bottomColor: '#f8f8f8',
        enablePlus: true,
        topInset: true,
        bottomInset: false,
    };

    genSafeAreaViewPlus = () => {
        // console.log("SafeAreaViewPlus: genSafeAreaViewPlus");
        //children组件里的子view
        const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
        return <View style={[styles.container, this.props.style]}>
            <BackPressComponent backPress={this.handlePress}/>
            {this.getTopArea(topColor, topInset)}
            {children}
            {this.getBottomArea(bottomColor, bottomInset)}
        </View>;
    }

    handlePress = () => {
        if (this.props.backPress) {
            return this.props.backPress()
        } else {
            return goBackN(this.props.backNav)
        }
    }

    genSafeAreaView = () => {
        // console.log("SafeAreaViewPlus: genSafeAreaView");
        return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
            {this.props.children}
        </SafeAreaView>
    }

    getTopArea(topColor, topInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !topInset ? null :
            <View style={[styles.topArea, {backgroundColor: topColor}]}/>;
    }

    getBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
            : <View style={[styles.bottomArea, {backgroundColor: bottomColor}]}/>;
    }

    render() {
        const {enablePlus} = this.props;
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    topArea: {
        height: 44,
    },
    bottomArea: {
        height: 34,
    }
});
