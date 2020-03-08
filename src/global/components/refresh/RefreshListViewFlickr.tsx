import React from 'react';
import {Dimensions, RefreshControl, ScrollView, Text} from 'react-native';
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import RefreshListBase from "~/global/components/refresh/RefreshListBase";
import RefreshProps from "~/global/components/refresh/RefreshProps";
import {RecyclerListViewState} from "recyclerlistview/dist/web/core/RecyclerListView";
import {RecyclerListViewProps} from "recyclerlistview/dist/reactnative/core/RecyclerListView";

const TAG = "RefreshListViewFlickr"

const screenWidth = Dimensions.get('window').width;

interface FRefreshProps extends RefreshProps {
    customLayoutProvider?: LayoutProvider,
    customDataProvider?: DataProvider
    extendedState?: any,
}

export default class RefreshListViewFlickr extends RefreshListBase<FRefreshProps> {
    private refreshListViewInner: any
    private mCustomScrollView: any

    static defaultProps = {
        ptrState: RefreshState.Refreshing,
    }

    layoutProvider = new LayoutProvider(index => {
            // console.log("RefreshListViewlayoutProvider invoke", index)
            return 0
        },
        (type, dim) => {
            dim.width = screenWidth
            dim.height = 100;
        }
    );
    dataProvider = new DataProvider((r1, r2) => {
        // console.log("RefreshListView2 dataProvider invoke", r1)
        return r1.id !== r2.id;
    });

    ScrollViewWithHeader = React.forwardRef(({children, ...props}) => {
        return <ScrollView
            {...props}
            ref={(view) => this.mCustomScrollView = view}
        >
            {this.props.ListHeaderComponent}
            {children}
        </ScrollView>;
    });

    render() {
        Logger.log(TAG, "render:", this.props);

        let customLayoutProvider = this.props.customLayoutProvider
        let customDataProvider = this.props.customDataProvider
        let data = this.props.data ? this.props.data : []
        let exProps = {}
        this.props.ListHeaderComponent && (exProps["externalScrollView"] = this.ScrollViewWithHeader)
        return <RecyclerListView
            // @ts-ignore
            style={this.props.style}
            renderFooter={() => this._renderFooter()}
            layoutProvider={customLayoutProvider ? customLayoutProvider : this.layoutProvider}
            dataProvider={customDataProvider ? customDataProvider : this.dataProvider.cloneWithRows(data)}
            rowRenderer={this._rowRenderer}
            forceNonDeterministicRendering={true}
            scrollViewProps={{
                refreshControl: (
                    <RefreshControl
                        refreshing={this.props.ptrState === RefreshState.Refreshing}
                        onRefresh={() => {
                            this.beginHeaderRefresh()
                        }}
                    />
                )
            }}
            onEndReached={() => {
                Logger.log(TAG, "onEndReached");
                this.beginFooterRefresh()
            }}
            extendedState={this.props.extendedState}
            onEndReachedThreshold={0.3}  // 这里取值0.1，可以根据实际情况调整，取值尽量小
            {...exProps}
            // @ts-ignore
            ref={(view) => this.refreshListViewInner = view}
        />
    }


    _rowRenderer = (type, data, index) => {
        return this.props.renderItem({item: data, index: index, separators: null})
    }

    scrollToTop(animate?: boolean) {
        Logger.log(TAG, "scrollToTop");
        this.refreshListViewInner && this.refreshListViewInner.scrollToTop(animate)
        this.mCustomScrollView && this.mCustomScrollView.scrollTo(0, 0)
    };
}
