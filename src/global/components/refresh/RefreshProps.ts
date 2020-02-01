import React, {ComponentType} from "react";
import {ListRenderItem} from "react-native";

export default interface RefreshProps {
    ListHeaderComponent?: ComponentType<any> | React.ReactElement | null,
    renderEmptyView?: Function | null,
    onFooterRefresh?: Function, // 上拉加载的方法

    data: Array<any> | null;
    renderItem: any,
    onHeaderRefresh: Function, // 下拉刷新的方法
    ptrState: string,
    keyExtractor: (item: any, index: number) => string,
}