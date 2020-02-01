import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import * as action from "./PublicAction";
import {getSearchWordList} from "../../search/SearchAction";

import TimelineCell from "../../timeline/TimelineCell";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import NavigationUtil from "../../../global/navigator/NavigationUtil";
import EventBus from "react-native-event-bus";
import EventType from "../../common/event/EventType";

class PublicPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('PublicPage componentWillMount', this.props);
        this.props.refreshTimeline([])
        this.props.getSearchWordList()
    }

    componentDidMount() {
        console.log('PublicPage componentDidMount', this.props);
        EventBus.getInstance().addListener(EventType.refreshKeywords, this.listener = data => {
            this.onSearchCallback(data)
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log("PublicPage nextProps:", nextProps)
    //     console.log("PublicPage nextState:", nextState)
    //     if (JSON.stringify(nextProps.search_searches_list) != JSON.stringify(this.state.search_searches_list)) {
    //         this.setState({
    //             search_searches_list: nextProps.search_searches_list
    //         })
    //         return false
    //     }
    //     return true
    // }

    render() {
        console.log("PublicPage render", this.props);
        return <RefreshListView
            ListHeaderComponent={this._renderHeader}
            theme={this.props.theme}
            ptrState={this.props.loadState}
            data={this.props.pageList ? this.props.pageList : []}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            onHeaderRefresh={() => {
                console.log("onHeaderRefresh");
                this.props.refreshTimeline(this.props.pageList)
                this.props.getSearchWordList()
            }}
        />
    }

    _renderHeader = () => {
        if (!this.props.search_searches_list) return null
        console.log("_renderHeader")
        let keywordViews = []
        let keywords = this.props.search_searches_list
        console.log("_renderHeader", keywords)
        for (let i = 0; i < keywords.length; i++) {
            keywordViews.push(
                <TouchableOpacity key={i} style={styles.keywordItem} onPress={
                    () => NavigationUtil.fromMainToPage("SearchScreen", {
                        url: `/q/${keywords[i].query}`,
                        queryId: keywords[i].id,
                    })
                }>
                    <Text>#{keywords[i].query}#</Text>
                </TouchableOpacity>
            );
        }
        return <ScrollView ref={(r) => this.scrollview = r}
                           maxWidth={'180%'} maxHeight={85} style={styles.keywordContainer} horizontal={true}
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
            //TODO do nothing
        } else {
            this.scrollview.scrollTo({x: 0, y: 0, animated: false});
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
        pageList: state.publicReducer.pageList,
        loadState: state.publicReducer.loadState,
        search_searches_list: state.searchReducer.search_searches_list,
    }),
    (dispatch) => ({
        refreshTimeline: (pageList) => dispatch(action.refreshTimeline(pageList)),
        getSearchWordList: () => dispatch(getSearchWordList()),
    })
)(PublicPage)
