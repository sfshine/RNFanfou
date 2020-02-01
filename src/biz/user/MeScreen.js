import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../global/navigator/Navigationbar";
import Global from "../../global/Global"
import * as loginAction from './login/LoginAction';
import {NavigationActions, StackActions} from "react-navigation";
import NavigationUtil from "../../global/navigator/NavigationUtil";

class MeScreen extends React.Component {

    componentWillMount() {
        console.log('HomeScreen componentWillMount', this.props);
    }

    render() {
        const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar//app标题栏
            title={'个人中心'}
            statusBar={statusBar}//状态栏配置
            style={theme.styles.navBar}//颜色遵循主题的
            rightButton={this.renderRightButton()}//标题栏右边按钮
        />;
        return <View style={styles.container}>
            {navigationBar}
            <Text>{Global.user.name}</Text>
        </View>
    }

    renderRightButton() {
        return <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.logoutAction}>
            <Text style={styles.buttonText}>退出</Text>
        </TouchableOpacity>
    }

    logoutAction = () => {
        this.props.logout()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'LoginScreen'})
            ]
        });
        NavigationUtil.main_navigation.dispatch(resetAction);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme
    }),
    (dispatch) => ({
        logout: () => dispatch(loginAction.logout())//connect后可以从props中获取这个方法的指针
    })
)(MeScreen)