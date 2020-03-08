import React, {ComponentType, PureComponent} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import RefreshFooter from './RefreshFooter';
import RefreshEmptyView from "./RefreshEmptyView";
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import RefreshProps from "~/global/components/refresh/RefreshProps";

const TAG = "RefreshListBase"


export default class RefreshListBase<P extends RefreshProps> extends PureComponent<P, {}> {
    static defaultProps = {
        ptrState: RefreshState.Refreshing,
    }

    _renderEmptyView() {
        return this.props.ListEmptyComponent || this._renderDefaultEmptyView()
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
        Logger.log(TAG, "_renderFooter", this.props);
        if (this.props.data && this.props.data.length > 0) {
            return (this.props.ListFooterComponent ||
                <RefreshFooter ptrState={this.props.ptrState}
                               onRetryLoading={() => {
                                   this.beginFooterRefresh()
                               }}/>
            )
        } else {
            return <View/>
        }
    };

    /// 开始下拉刷新
    beginHeaderRefresh() {
        Logger.log(TAG, "beginHeaderRefresh");
        if (this.shouldStartHeaderRefreshing()) {
            this.startHeaderRefreshing();
        } else {
            Logger.log(TAG, "No need HeaderRefresh")
        }
    }

    /// 开始上拉加载更多
    beginFooterRefresh() {
        Logger.log(TAG, "beginFooterRefresh");
        if (this.shouldStartFooterRefreshing()) {
            this.startFooterRefreshing();
        } else {
            Logger.log(TAG, "No need FooterRefresh")
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
        return this.props.ptrState == RefreshState.Idle || this.props.ptrState == RefreshState.LoadingMoreEnd || this.props.ptrState == RefreshState.LoadingMoreError;

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
        return this.props.ptrState == RefreshState.Idle
    }
}
