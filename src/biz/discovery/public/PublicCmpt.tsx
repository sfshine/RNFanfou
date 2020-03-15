import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import * as action from "./PublicAction";

import TimelineCell from "~/biz/timeline/TimelineCell";
import RefreshListView from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import RefreshFooter from "~/global/components/refresh/RefreshFooter";
import RefreshState from "~/global/components/refresh/RefreshState";
import Logger from "~/global/util/Logger";
import {SearchAction} from "~/biz/search/SearchAction";
import {ResetRedux} from "~/biz/discovery/public/PublicReducer";
import DoubleClick from "~/global/util/DoubleClick";
import EventBus from 'react-native-event-bus'
import {BusEvents} from "~/biz/common/event/BusEvents";
import ReduxResetComponent from "~/global/components/ReduxResetComponent";

interface Props extends BaseProps {
    refreshTimeline: Function,
    getSearchWordList: Function,
    ptrState: string,
    pageList: Array<any>,
    search_searches_list: Array<any>,
    clearRedux: Function,
}

const TAG = "PublicCmpt"
const doubleClick = new DoubleClick()

class PublicCmpt extends React.PureComponent<Props> {
    private scrollView: any
    private refreshListView: any
    private refreshListener: any

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Logger.log(TAG, 'PublicCmpt componentWillMount', this.props);
        this.props.refreshTimeline([])
        this.props.getSearchWordList()
    }

    componentDidMount(): void {
        EventBus.getInstance().addListener(BusEvents.refreshPublicTimeline,
            this.refreshListener = () => doubleClick.wrap(() => {
                this.props.refreshTimeline([])
                this.refreshListView && this.refreshListView.scrollToTop(true)
            }))
    }

    componentWillUnmount(): void {
        EventBus.getInstance().removeListener(this.refreshListener);
    }

    render() {
        Logger.log(TAG, "PublicCmpt render", this.props);
        return <View style={{flex: 1}}>
            <RefreshListView
                ref={(view) => this.refreshListView = view}
                ListHeaderComponent={this._renderHeader()}
                ptrState={this.props.ptrState}
                data={this.props.pageList ? this.props.pageList : []}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                ListFooterComponent={this._renderFooter(this.props.pageList)}
                onHeaderRefresh={() => {
                    Logger.log(TAG, "onHeaderRefresh");
                    this.props.refreshTimeline(this.props.pageList)
                    this.props.getSearchWordList()
                }}
            />
            <ReduxResetComponent resetAction={ResetRedux}/>
        </View>
    }

    _renderFooter = (data) => {
        if (data && data.length > 0) {
            return (<RefreshFooter ptrState={RefreshState.LoadingMoreEnd}/>)
        } else {
            return null
        }
    };
    _renderHeader = () => {
        if (!this.props.search_searches_list) return null
        Logger.log(TAG, "_renderHeader")
        let keywordViews = []
        let keywords = this.props.search_searches_list
        Logger.log(TAG, "_renderHeader", keywords)
        for (let i = 0; i < keywords.length; i++) {
            keywordViews.push(
                <TouchableOpacity key={i} style={styles.keywordItem} onPress={
                    () => navigateN(NavigationManager.mainNavigation, "SearchPage", {
                        url: `/q/${keywords[i].query}`,
                        queryId: keywords[i].id,
                    })
                }>
                    <Text>{keywords[i].query}</Text>
                </TouchableOpacity>
            );
        }
        return <ScrollView ref={(r) => this.scrollView = r}
            // maxWidth={'180%'}
            // maxHeight={85}
                           style={styles.keywordContainer} horizontal={true}
                           showsHorizontalScrollIndicator={false}>
            {keywordViews}
        </ScrollView>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };
    onSearchCallback = (data) => {
        this.props.getSearchWordList()
        if (data.isCreate) {
            // do nothing
        } else {
            this.scrollView.scrollTo({x: 0, y: 0, animated: false});
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keywordContainer: {
        flexWrap: "wrap",
        flexDirection: 'row',
        padding: 3,
        marginBottom: -5,//ListView Item的MarginTop = 5
    },
    keywordItem: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000000',
        height: 35,
        margin: 3,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 1,
        backgroundColor: '#FFFFFF',
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageList: state.PublicReducer.pageList,
        ptrState: state.PublicReducer.ptrState,
        search_searches_list: state.SearchReducer.search_searches_list,
    }),
    (dispatch) => ({
        refreshTimeline: (pageList) => dispatch(action.refreshTimeline(pageList)),
        getSearchWordList: () => dispatch(SearchAction.getSearchWordList()),
    })
)(PublicCmpt)
