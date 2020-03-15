import React, {PureComponent} from "react";
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
    StyleSheet,//样式
    View,//视图组件；
    Image,//图片
    TextInput,//输入框
    TouchableOpacity, TextInputProps,//一个类似button的组件
} from "react-native";

interface Props extends TextInputProps {
    onRightButtonClick: Function,
}

interface State {
    inputValue: string
}

export default class TextInputEx extends PureComponent<Props, State> {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            inputValue: "",
        };
    }

    _isNull(str) {
        return !(str && str.length > 0)
    }

    render() {
        let {inputValue} = this.state;
        inputValue = inputValue || this.props.value
        return (
            <View style={styles.container}>
                <TextInput
                    underlineColorAndroid="transparent"
                    numberOfLines={1}
                    clearButtonMode={'never'}
                    maxLength={50}
                    value={inputValue}
                    {...this.props}
                    onChangeText={this.onChangeTextInner}
                />
                {this._isNull(inputValue) ? null : this._getRightButtonView()}
            </View>
        );
    }

    _getRightButtonView() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeOpacityStyle}
                onPress={() => {
                    this.props.onRightButtonClick();
                }}>
                <Ionicons name={"md-close"} size={20} style={{color: 'white'}}/>
            </TouchableOpacity>)
    }

    onChangeTextInner = (changeText) => {
        this.setState({
            inputValue: changeText,
        });
        this.props.onChangeText && this.props.onChangeText(changeText)
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
        },
        closeOpacityStyle: {
            height: 30,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center'
        },
    }
)
