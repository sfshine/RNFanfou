import React from 'react';
import {connect} from "react-redux";
import TimelineAction from "./TimelineAction";
import TimelineCell from "./TimelineCell";
import RefreshListView from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";
import {ResetRedux, TIMELINE_ACTIONS} from "~/biz/timeline/TimelineReducer";

interface Props extends BaseProps {
    actionData: Array<any>,
    ptrState: string,
    refreshTimeline: Function,
    loadMoreTimeline: Function,
    clearRedux: Function,
}

class TimelineCmpt extends React.PureComponent<Props> {

    componentWillMount() {
        this.props.refreshTimeline()
    }

    componentWillUnmount(): void {
        this.props.clearRedux()
    }

    render() {
        return <RefreshListView
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

const mTimelineAction = new TimelineAction()//TimelineAction缓存了PageNumber所以这里使用成员变量
export default connect(
    (state) => ({
        actionData: state.TimelineReducer.actionData,
        ptrState: state.TimelineReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (oldActionData) => dispatch(mTimelineAction.loadMoreTimeline(oldActionData)),
        refreshTimeline: () => dispatch(mTimelineAction.refreshTimeline()),
        clearRedux: () => dispatch(ResetRedux)
    })
)(TimelineCmpt)
