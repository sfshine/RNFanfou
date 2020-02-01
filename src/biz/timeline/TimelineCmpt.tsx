import React from 'react';
import {connect} from "react-redux";
import TimelineAction from "./TimelineAction";
import TimelineCell from "./TimelineCell";
import RefreshListView2 from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";

interface Props extends BaseProps {
    actionData: Array<any>,
    ptrState: string,
    refreshTimeline: Function,
    loadMoreTimeline: Function,
}

class TimelineCmpt extends React.Component<Props> {

    componentWillMount() {
        this.props.refreshTimeline()
    }

    render() {
        return <RefreshListView2
            data={this.props.actionData ? this.props.actionData : []}
            ptrState={this.props.ptrState}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            onHeaderRefresh={() => {
                this.props.refreshTimeline()
            }}
            onFooterRefresh={() => {
                this.props.loadMoreTimeline(this.props.actionData)
            }}
        />
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };
}

export default connect(
    (state) => ({
        actionData: state.TimelineReducer.actionData,
        ptrState: state.TimelineReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (oldActionData) => dispatch(TimelineAction.loadMoreTimeline(oldActionData)),
        refreshTimeline: () => dispatch(TimelineAction.refreshTimeline())
    })
)(TimelineCmpt)
