import React, {PureComponent} from 'react';
import {Dimensions, RefreshControl, ScrollView, Text} from 'react-native';
import Logger from "../../util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import RefreshListBase from "~/global/components/refresh/RefreshListBase";
import RefreshProps from "~/global/components/refresh/RefreshProps";
import RefreshListViewFlickr from "~/global/components/refresh/RefreshListViewFlickr";

const TAG = "RefreshGridViewFlickr"

const screenWidth = Dimensions.get('window').width;

const ViewTypes = {
    MID: 0,
    LEFT: 1,
    RIGHT: 2
}

export default class RefreshGridViewFlickr extends PureComponent<RefreshProps> {
    layoutProvider = new LayoutProvider(
        index => {
            if (index % 3 === 0) {
                return ViewTypes.LEFT;
            } else if (index % 3 === 1) {
                return ViewTypes.MID;
            } else {
                return ViewTypes.RIGHT;
            }
        },
        (type, dim) => {
            dim.width = screenWidth / 3;
            dim.height = 100;
        }
    );

    render() {
        return <RefreshListViewFlickr
            customLayoutProvider={this.layoutProvider} {...this.props}>
        </RefreshListViewFlickr>
    }
}
