import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from "react-redux";
import * as action from "./TimelineAction";
import TimelineCell from "../TimelineCell";
import RefreshListView2 from "../../../global/components/refresh/RefreshListView2";
import NavigationUtil from "../../../global/navigator/NavigationUtil";

class TimelinePage extends React.Component {

    constructor(props) {
        super(props);
        console.log('TimelinePage constructor', this.props);
    }

    componentWillMount() {
        console.log('TimelinePage componentWillMount', this.props);
        this.props.refreshTimeline()
    }

    componentDidMount() {
        console.log('TimelinePage componentDidMount', this.props);
    }


    render() {
        console.log("TimelinePage render", this.props);
        return <RefreshListView2
            theme={this.props.theme}
            data={this.props.pageData ? this.props.pageData.data : []}
            ptrState={this.props.loadState}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            onHeaderRefresh={() => {
                console.log("onHeaderRefresh");
                this.props.refreshTimeline()
            }}
            onFooterRefresh={() => {
                console.log("onFooterRefresh");
                this.props.loadMoreTimeline(this.props.pageData)
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.timelineReducer.pageData,
        loadState: state.timelineReducer.loadState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (oldPageData) => dispatch(action.loadMoreTimeline(oldPageData)),
        refreshTimeline: () => dispatch(action.refreshTimeline())

    })
)(TimelinePage)