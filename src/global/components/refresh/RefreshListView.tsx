import React, {ComponentType, PureComponent} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import RefreshFooter from './RefreshFooter';
import RefreshEmptyView from "./RefreshEmptyView";
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import RefreshProps from "~/global/components/refresh/RefreshProps";
import RefreshListBase from "~/global/components/refresh/RefreshListBase";

const TAG = "RefreshListView"


export default class RefreshListView extends RefreshListBase<RefreshProps> {
    static defaultProps = {
        ptrState: RefreshState.Refreshing,
    }

    render() {
        Logger.log(TAG, "render:", this.props)
        let data = this.props.data ? this.props.data : []
        return <FlatList
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={this.props.keyExtractor}
            ListHeaderComponent={this.props.ListHeaderComponent}
            ListEmptyComponent={this._renderEmptyView()}
            ListFooterComponent={this._renderFooter()}
            renderItem={this.props.renderItem}
            data={data}
            refreshing={this.props.ptrState === RefreshState.Refreshing}
            onRefresh={() => {
                this.beginHeaderRefresh()
            }}
            onEndReached={
                () => {
                    Logger.log(TAG, "onEndReached");
                    this.beginFooterRefresh()
                }
            }
            onEndReachedThreshold={0.3}  // 这里取值0.1，可以根据实际情况调整，取值尽量小
        />
    }
}
