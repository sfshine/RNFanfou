import React, {ComponentType, PureComponent} from "react";
import {ActivityIndicator, ListRenderItem, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import RefreshState from "./RefreshState";

interface Props {
    ptrState: string,
    emptyViewMsg: string,
    emptyViewLoadingMsg: string,
    onRetryLoading: Function,
}

export default class RefreshEmptyView extends PureComponent<Props, {}> {

    static defaultProps = {
        emptyViewMsg: "没有数据，下拉刷新试试",
        emptyViewLoadingMsg: "努力加载中",
    };

    render() {
        let {ptrState} = this.props;
        let emptyView = null;
        switch (ptrState) {
            case RefreshState.Refreshing:
                emptyView = <View style={styles.emptyView}>
                    <Text style={styles.emptyViewText}>{this.props.emptyViewLoadingMsg}</Text>
                </View>;
                break;
            case RefreshState.Idle:
                emptyView = <TouchableOpacity style={styles.emptyView} onPress={() => {
                    this.props.onRetryLoading && this.props.onRetryLoading();
                }}>
                    <Text style={styles.emptyViewText}>{this.props.emptyViewMsg}</Text>
                </TouchableOpacity>;
                break;
        }
        return emptyView;
    }
}

const styles = StyleSheet.create({
    emptyView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyViewText: {
        marginTop: 10,
        fontSize: 15,
    }
});
