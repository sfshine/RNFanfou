import React, {PureComponent} from "react";
import {BackHandler, View} from "react-native";

/**
 * Android物理回退键处理
 */
interface Props {
    backPress: Function
}

export default class BackPressComponent extends PureComponent<Props> {
    constructor(props) {
        super(props)
    }

    private onHardwareBackPress = () => {
        return this.props.backPress();//backPress的值是onBackPress函数
    }

    componentDidMount() {
        if (this.props.backPress) BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    componentWillUnmount() {
        if (this.props.backPress) BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
    }

    render() {
        return null
    }
}
