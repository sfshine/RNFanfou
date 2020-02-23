import {connect} from "react-redux";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import {StyleSheet, TouchableOpacity} from "react-native";
import * as React from "react";
import {PureComponent} from "react";
import {screenWidth} from "~/global/util/ScreenUtil";
import AntDesign from 'react-native-vector-icons/AntDesign'
import BaseProps from "~/global/base/BaseProps";

class ComposeButton extends PureComponent<BaseProps> {
    render() {
        const {theme} = this.props;
        return <TouchableOpacity style={[styles.composeButton, {backgroundColor: theme.brand_primary}]}
                                 activeOpacity={0.7}
                                 onPress={this.compose}>
            <AntDesign style={{color: 'white'}} name={'edit'} size={20}/>
        </TouchableOpacity>
    }

    compose = () => {
        navigateN(NavigationManager.mainNavigation, "ComposePage")
    }
}

const styles = StyleSheet.create({
    composeButton: {
        borderRadius: 35,
        shadowRadius: 8,
        shadowColor: '#aaaaaa',
        shadowOpacity: 0.6,
        shadowOffset: {width: 0, height: 3},
        width: 45,
        height: 45,
        zIndex: 100,
        position: 'absolute',
        left: screenWidth - 55,
        bottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(ComposeButton)
