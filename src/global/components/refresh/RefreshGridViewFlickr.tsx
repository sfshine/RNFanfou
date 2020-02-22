import React, {PureComponent} from 'react';
import {Dimensions, RefreshControl, ScrollView, Text} from 'react-native';
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import RefreshListBase from "~/global/components/refresh/RefreshListBase";
import RefreshProps from "~/global/components/refresh/RefreshProps";
import RefreshListViewFlickr from "~/global/components/refresh/RefreshListViewFlickr";
import {screenWidth} from "~/global/util/ScreenUtil";

const TAG = "RefreshGridViewFlickr"

export default class RefreshGridViewFlickr extends PureComponent<RefreshProps> {
    layoutProvider = new LayoutProvider(
        index => {
            return 0
        },
        (type, dim) => {
            dim.width = screenWidth / 3;
            dim.height = screenWidth / 3;
        }
    );

    render() {
        return <RefreshListViewFlickr
            customLayoutProvider={this.layoutProvider} {...this.props}>
        </RefreshListViewFlickr>
    }
}
