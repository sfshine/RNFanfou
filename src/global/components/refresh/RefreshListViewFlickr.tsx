import React from 'react';
import {Dimensions, RefreshControl, ScrollView, Text} from 'react-native';
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import RefreshListBase from "~/global/components/refresh/RefreshListBase";

const TAG = "RefreshListView"

const screenWidth = Dimensions.get('window').width;

export default class RefreshListViewFlickr extends RefreshListBase {
    static defaultProps = {
        ptrState: RefreshState.Refreshing,
    }

    layoutProvider = new LayoutProvider(index => {
            // console.log("RefreshListViewlayoutProvider invoke", index)
            return 0
        },
        (type, dim) => {
            dim.width = screenWidth
            dim.height = 180;
        }
    );
    dataProvider = new DataProvider((r1, r2) => {
        // console.log("RefreshListView2 dataProvider invoke", r1)
        return r1.id !== r2.id;
    });

    ScrollViewWithHeader = React.forwardRef(({children, ...props}) => {
        return <ScrollView
            {...props}
        >
            {this.props.ListHeaderComponent}
            {children}
        </ScrollView>;
    });

    render() {
        Logger.log(TAG, "render:", this.props);
        let data = this.props.data ? this.props.data : []
        return <RecyclerListView
            // @ts-ignore
            externalScrollView={this.ScrollViewWithHeader}
            renderFooter={() => this._renderFooter()}
            data={data}
            layoutProvider={this.layoutProvider}
            dataProvider={this.dataProvider.cloneWithRows(this.props.data)}
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
            }
            }
            onEndReachedThreshold={0.3}  // 这里取值0.1，可以根据实际情况调整，取值尽量小
        />
    }


    _rowRenderer = (type, data, index) => {
        return this.props.renderItem({item: data, index: index, separators: null})
    }
}
