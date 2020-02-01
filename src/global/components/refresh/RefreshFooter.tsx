import React, {PureComponent} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RefreshState from './RefreshState';
import {connect} from "react-redux";

interface Props {
    ptrState: string,
    onRetryLoading: Function,
    theme: any,
    footerRefreshingText: string,
    footerFailureText: string,
    footerNoMoreDataText: string,
}

class RefreshFooter extends PureComponent<Props, {}> {
    static defaultProps = {
        footerRefreshingText: "努力加载中",
        footerFailureText: "点击重新加载",
        footerNoMoreDataText: "没有更多数据了"
    };

    render() {
        let {ptrState, theme} = this.props;
        let footer = null;
        switch (ptrState) {
            case RefreshState.LoadingMoreEnd:
                footer =
                    <View style={styles.loadingView}>
                        <Text style={styles.footerText}>{this.props.footerNoMoreDataText}</Text>
                    </View>;
                break;
            case RefreshState.LoadingMoreError:
                footer =
                    <TouchableOpacity style={styles.loadingView} onPress={() => {
                        this.props.onRetryLoading && this.props.onRetryLoading();
                    }}>
                        <Text style={styles.footerText}>{this.props.footerFailureText}</Text>
                    </TouchableOpacity>;
                break;
            default:
                footer =
                    <View style={styles.loadingView}>
                        <ActivityIndicator size="small" color={theme.brand_primary}/>
                        <Text style={styles.refreshingText}>{this.props.footerRefreshingText}</Text>
                    </View>;
                break;
        }
        return footer;
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    refreshingText: {
        fontSize: 12,
        color: "#666666",
        paddingLeft: 10,
    },
    footerText: {
        fontSize: 12,
        color: "#666666"
    }
});
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(RefreshFooter)
