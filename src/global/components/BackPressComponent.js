import React, {PureComponent} from "react";
import {BackHandler, View} from "react-native";

/**
 * Android物理回退键处理
 */
export default class BackPressComponent extends PureComponent {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    componentWillUnmount() {
        if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    onHardwareBackPress = (e) => {
        return this.props.backPress(e);//backPress的值是onBackPress函数
    }

    render() {
        return null
    }
}