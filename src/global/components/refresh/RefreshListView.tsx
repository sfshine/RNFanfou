import React, {ComponentType, PureComponent} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import RefreshFooter from './RefreshFooter';
import RefreshEmptyView from "./RefreshEmptyView";
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import RefreshProps from "~/global/components/refresh/RefreshProps";

const TAG = "RefreshListView"


export default class RefreshListView extends PureComponent<RefreshProps, {}> {
    static defaultProps = {
        ptrState: RefreshState.Refreshing,
    }

    render() {
        Logger.log(TAG, "render:", this.props);
        return <FlatList
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={this.props.keyExtractor}
            ListEmptyComponent={this._renderEmptyView()}
            ListHeaderComponent={this.props.ListHeaderComponent}
            ListFooterComponent={this._renderFooter}
            renderItem={this.props.renderItem}
            data={this.props.data}
            refreshing={this.props.ptrState === RefreshState.Refreshing}
            onRefresh={() => {
                this.beginHeaderRefresh()
            }}
            onEndReached={
                () => {
                    Logger.log(TAG, "onEndReached");
                    if (this.props.ptrState != RefreshState.LoadingMoreError) {
                        this.beginFooterRefresh()
                    }
                }
            }
            onEndReachedThreshold={0.1}  // 这里取值0.1，可以根据实际情况调整，取值尽量小
        />
    }

    _renderEmptyView() {
        return this.props.renderEmptyView ? this.props.renderEmptyView() : this._renderDefaultEmptyView()
    }

    _renderDefaultEmptyView = () => {
        Logger.log(TAG, "_renderDefaultEmptyView");
        return (
            <RefreshEmptyView
                ptrState={this.props.ptrState}
                onRetryLoading={() => {
                    this.beginHeaderRefresh()
                }}
            />
        )
    };

    _renderFooter = () => {
        Logger.log(TAG, "_renderFooter", this.props.ptrState);
        if (this.props.data.length > 0) {
            return (<RefreshFooter
                    ptrState={this.props.ptrState}
                    onRetryLoading={() => {
                        this.beginFooterRefresh()
                    }}
                />
            )
        } else {
            return null
        }
    };

    /// 开始下拉刷新
    beginHeaderRefresh() {
        Logger.log(TAG, "beginHeaderRefresh");
        if (this.shouldStartHeaderRefreshing()) {
            this.startHeaderRefreshing();
        }
    }

    /// 开始上拉加载更多
    beginFooterRefresh() {
        Logger.log(TAG, "beginFooterRefresh");
        if (this.shouldStartFooterRefreshing()) {
            this.startFooterRefreshing();
        }
    }

    startHeaderRefreshing() {
        this.props.onHeaderRefresh && this.props.onHeaderRefresh();
    }

    startFooterRefreshing() {
        this.props.onFooterRefresh && this.props.onFooterRefresh();
    }

    /***
     * 当前是否可以进行下拉刷新
     * @returns {boolean}
     *
     * 如果列表尾部正在执行上拉加载，就返回false
     * 如果列表头部已经在刷新中了，就返回false
     */
    shouldStartHeaderRefreshing() {
        if (this.props.ptrState === RefreshState.LoadingMore || this.props.ptrState === RefreshState.Refreshing) {
            return false;
        }
        return true;
    }

    /***
     * 当前是否可以进行上拉加载更多
     * @returns {boolean}
     *
     * 如果底部已经在刷新，返回false
     * 如果底部状态是没有更多数据了，返回false
     * 如果头部在刷新，则返回false
     * 如果列表数据为空，则返回false（初始状态下列表是空的，这时候肯定不需要上拉加载更多，而应该执行下拉刷新）
     */
    shouldStartFooterRefreshing() {
        if (this.props.ptrState === RefreshState.LoadingMore ||
            this.props.ptrState === RefreshState.Refreshing) {
            return false;
        }
        return true;
    }
}
