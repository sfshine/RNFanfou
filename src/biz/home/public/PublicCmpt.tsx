import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import {PublicAction} from "./PublicAction";

import TimelineCell from "../../timeline/TimelineCell";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import RefreshFooter from "~/global/components/refresh/RefreshFooter";
import RefreshState from "~/global/components/refresh/RefreshState";
import Logger from "~/global/util/Logger";
import {SearchAction} from "~/biz/search/SearchAction";

interface Props extends BaseProps {
    refreshTimeline: Function,
    loadMore: Function,
    getSearchWordList: Function,
    ptrState: string,
    pageData: Array<any>,
    search_searches_list: Array<any>,
}

const action = new PublicAction()
const TAG = "PublicCmpt"

class PublicCmpt extends React.PureComponent<Props> {
    private scrollView: any;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Logger.log(TAG, 'PublicCmpt componentWillMount', this.props);
        this.props.refreshTimeline()
        this.props.getSearchWordList()
    }

    componentDidMount() {
        Logger.log(TAG, 'PublicCmpt componentDidMount', this.props);
    }

    render() {
        Logger.log(TAG, "PublicCmpt render", this.props);
        return <RefreshListView
            ListHeaderComponent={this._renderHeader}
            ptrState={this.props.ptrState}
            data={this.props.pageData ? this.props.pageData : []}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            onHeaderRefresh={() => {
                Logger.log(TAG, "onHeaderRefresh");
                this.props.refreshTimeline()
                this.props.getSearchWordList()
            }}
            onFooterRefresh={() => {
                console.log("onFooterRefresh");
                this.props.loadMore(this.props.pageData)
            }}
        />
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
        pageData: state.PublicReducer.pageData,
        ptrState: state.PublicReducer.ptrState,
        search_searches_list: state.SearchReducer.search_searches_list,
    }),
    (dispatch) => ({
        refreshTimeline: () => dispatch(action.loadPublicTimeline()),
        loadMore: (oldData) => dispatch(action.loadMore(oldData)),
        getSearchWordList: () => dispatch(SearchAction.getSearchWordList()),
    })
)(PublicCmpt)
