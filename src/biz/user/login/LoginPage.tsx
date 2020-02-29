import {StyleSheet, Text, Image, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import * as React from "react";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import LoginAction from "~/biz/user/login/LoginAction";
import BaseProps from "~/global/base/BaseProps";
import ConfirmExitHelper from "~/global/components/ConfirmExitHelper";

/**
 * @author Alex
 * @date 2020/02/01
 */
interface Props extends BaseProps {
    onSubmitLogin: Function;
}

interface State {
    account: string;
    password: string;
}

const TAG = "LoginPage"
const confirmExitHelper = new ConfirmExitHelper()

class LoginPage extends React.PureComponent<Props, {}> {
    static defaultProps = {
        actionData: []
    }

    public state = {
        account: "sfshine@qq.com",
        password: "11yue102030",
    }

    componentDidMount(): void {
    }

    render() {
        return <PageCmpt backNav={this.props.navigation} overrideBackPress={confirmExitHelper.overrideBackPress}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        let theme = this.props.theme
        Logger.log(TAG, "this.state：", this.state)
        return <View style={styles.container}>
            <Image style={{height: 100, width: 100, marginBottom: 50, marginTop: 100, alignSelf: "center"}}
                   source={require("#/ic_launcher.png")}/>
            <TextInput
                style={styles.textField}
                placeholder={'请输入账号'}
                returnKeyType={'next'}
                returnKeyLabel={'next'}
                clearButtonMode={'while-editing'}
                keyboardType={'default'}
                autoFocus={false}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                value={this.state.account}
                onChangeText={(text) => this.setState({account: text})}
            />
            <TextInput
                style={styles.textField}
                placeholder={'请输入密码'}
                returnKeyType={'next'}
                returnKeyLabel={'next'}
                clearButtonMode={'while-editing'}
                keyboardType={'default'}
                maxLength={14}
                secureTextEntry={true}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
            />
            <TouchableOpacity style={[styles.loginButton, {backgroundColor: theme.brand_primary}]} activeOpacity={0.7}
                              onPress={() => this.checkAndLogin()}>
                <Text style={styles.buttonText}>登录</Text>
            </TouchableOpacity>
        </View>
    }

    checkAndLogin() {
        let account = this.state.account;
        let password = this.state.password;
        if (!account || !password) {
            TipsUtil.toast("请检查输入的用户名和密码是否正确")
        } else {
            this.props.onSubmitLogin(account, password, this.props.navigation)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textField: {
        width: "80%",
        marginTop: 10,
        backgroundColor: 'white',
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#dcdcdc',
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        alignSelf: "center",
    },
    loginButton: {
        marginTop: 10,
        width: "80%",
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        alignSelf: "center",
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    }
});
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        actionData: state.LoginReducer.actionData,
    }),
    (dispatch) => ({
        onSubmitLogin: (account, password, navigation) => dispatch(LoginAction.onSubmitLogin(account, password, navigation))
    })
)(LoginPage)
