import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Keyboard, TextInput, Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import * as loginAction from './LoginAction';
import NavigationUtil from "../../../global/navigator/NavigationUtil";

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            pwd: '',
        }
    }
    componentDidMount() {
        console.log('LoginScreen mounted', this.props);
    }

    static navigationOptions = {
        headerTitle: '登录'
    };

    shouldComponentUpdate(nextProps, nextState) {//接收 Props的变化。如果变化为isSuccess =true则跳转
        if (nextProps.isSuccess) {
            setTimeout(() => {
                NavigationUtil.resetTo(this.props, "MainScreen");
            }, 0)
            return true;//如果是false,则"登录中..."这个textview不会刷新 因为shouldComponentUpdate返回了false
        }
        return true;
    }

    render() {
        const {errorMessage, isSuccess, loading} = this.props;
        return (
            <View style={styles.container}>
                <TextInput
                    ref={(ref) => this.accountTextField = ref}
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
                    ref={(ref) => this.pwdTextField = ref}
                    style={styles.textField}
                    placeholder={'请输入密码'}
                    returnKeyType={'next'}
                    returnKeyLabel={'next'}
                    clearButtonMode={'while-editing'}
                    keyboardType={'default'}
                    maxLength={14}
                    secureTextEntry={true}
                    underlineColorAndroid={'transparent'}
                    onChangeText={(text) => this.setState({pwd: text})}
                    value={this.state.pwd}
                />
                <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={() => this.checkAndLogin()}>
                    <Text style={styles.buttonText}>登录</Text>
                </TouchableOpacity>
                <Text style={{marginTop: 10}}>
                    {loading ? "登录中..." : (isSuccess ? "登录成功" : errorMessage)/*这里可以接收到登录的状态*/}
                </Text>
            </View>
        )
    }

    checkAndLogin() {
        let account = this.state.account;
        let pwd = this.state.pwd;
        account = "sfshine@qq.com"
        pwd = "11yue102030"
        console.log(account, pwd)
        if (!account || !pwd) {
            console.log("Invalid account or pwd")
        }
        else {
            this.props.login(account, pwd)
        }
    }
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textField: {
        width: screenWidth * 4 / 5,
        marginTop: 10,
        backgroundColor: 'white',
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#dcdcdc',
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    loginButton: {
        marginTop: 10,
        width: 150,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#4ca5ff',
        alignItems: 'center',
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
        errorMessage: state.loginReducer.errorMessage,//reducer 处理完数据后可以在这里设置到props中
        isSuccess: state.loginReducer.isSuccess,
        user: state.loginReducer.user,
        loading: state.loginReducer.loading
    }),
    (dispatch) => ({
        login: (account, pwd) => dispatch(loginAction.login(account, pwd))//connect后可以从props中获取这个方法的指针
    })
)(LoginScreen)
