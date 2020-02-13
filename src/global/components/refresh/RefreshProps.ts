import React, {ComponentType} from "react";
import {FlatListProps, ListRenderItem} from "react-native";

export default interface RefreshProps extends FlatListProps<any> {
    onFooterRefresh?: Function, // 上拉加载的方法
    onHeaderRefresh: Function, // 下拉刷新的方法

    data: Array<any> | null;
    ptrState: string,
}
