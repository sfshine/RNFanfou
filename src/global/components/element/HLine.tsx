import {View} from "react-native";
import React from "react";

interface Props {
    style: object;
}

export default class HLine extends React.PureComponent<Props, {}> {
    render() {
        return <View style={[{height: 0.7, backgroundColor: "#EEEEEE"}, this.props.style]}/>
    }
}
