import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from "react-redux";
import FavouriteAction from "./FavouriteAction";
import TimelineCell from "../../timeline/TimelineCell";
import RefreshListViewFlickr from "../../../global/components/refresh/RefreshListViewFlickr";
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import Logger from "~/global/util/Logger";

interface Props extends BaseProps {
    refreshTimeline: Function,
    loadMoreTimeline: Function,
    pageData: [],
    ptrState: string,
}

const TAG = "FavouritePage"
const action = new FavouriteAction()

class FavouritePage extends PureComponent<Props> {
    private user: any;

    componentWillMount() {
        Logger.log(TAG, 'FavouritePage componentWillMount', this.props);
        this.user = this.props.navigation.state.params.user;
        this.props.refreshTimeline(this.user.id)
    }

    render() {
        Logger.log(TAG, "FavouritePage render", this.props);
        return <PageCmpt title={`${this.user.name}的收藏`} backNav={this.props.navigation}>
            <RefreshListViewFlickr
                data={this.props.pageData ? this.props.pageData : []}
                ptrState={this.props.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    Logger.log(TAG, "onHeaderRefresh");
                    this.props.refreshTimeline(this.user.id)
                }}
                onFooterRefresh={() => {
                    Logger.log(TAG, "onFooterRefresh");
                    this.props.loadMoreTimeline(this.user.id, this.props.pageData)
                }}
            />
        </PageCmpt>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default connect(
    (state) => ({
        pageData: state.FavouriteReducer.actionData,
        ptrState: state.FavouriteReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (id, oldPageData) => dispatch(action.loadMoreTimeline(id, oldPageData)),
        refreshTimeline: (id) => dispatch(action.refreshTimeline(id))

    })
)(FavouritePage)
