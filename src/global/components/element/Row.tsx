import {View} from "react-native";
import React, {ReactChild} from "react";

interface Props {
    style?: object;
}

export default class Row extends React.PureComponent<Props, {}> {
    render() {
        let style = this.props.style ? this.props.style : {}
        return <View style={[style, {flexDirection: "row", alignItems: "center"}]}>
            {this.props.children}
        </View>
    }
}
