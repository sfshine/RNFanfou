import React from 'react';
import {connect} from "react-redux";
import RefreshListView from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";
import PageCmpt from "~/global/components/PageCmpt";
import MessageAction from "~/biz/message/MessageAction";
import TimelineCell from "~/biz/timeline/TimelineCell";
import {BusEvents} from "~/biz/common/event/BusEvents";
import DoubleClick from "~/global/util/DoubleClick";
import EventBus from 'react-native-event-bus'

interface Props extends BaseProps {
    actionData: Array<any>,
    ptrState: string,
    refreshTimeline: Function,
    loadMoreTimeline: Function,
}

class MessageFragment extends React.PureComponent<Props> {
    private doubleClick = new DoubleClick()
    private refreshListener
    private refreshListView: any

    componentDidMount(): void {
        this.props.refreshTimeline()
        EventBus.getInstance().addListener(BusEvents.refreshMention,
            this.refreshListener = () => this.doubleClick.wrap(() => {
                this.props.refreshTimeline([])
                this.refreshListView && this.refreshListView.scrollToTop(true)
            }))
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.refreshListener);
    }
    render() {
        return <PageCmpt title="与我相关"><RefreshListView
            ref={(view) => this.refreshListView = view}
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
        /></PageCmpt>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };
}

const action = new MessageAction()
export default connect(
    (state) => ({
        actionData: state.MessageReducer.actionData,
        ptrState: state.MessageReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (oldActionData) => dispatch(action.loadMoreTimeline(oldActionData)),
        refreshTimeline: () => dispatch(action.refreshTimeline())
    })
)(MessageFragment)
