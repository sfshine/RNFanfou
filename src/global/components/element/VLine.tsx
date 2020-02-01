import {View} from "react-native";
import React from "react";

interface Props {
    style: object;
}

export default class VLine extends React.PureComponent<Props, {}> {
    render() {
        return <View style={[{width: 0.7, backgroundColor: "#EEEEEE"}, this.props.style]}/>
    }
}
