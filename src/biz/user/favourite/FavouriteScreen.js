import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from "react-redux";
import * as action from "./FavouriteAction";
import TimelineCell from "../../timeline/TimelineCell";
import RefreshListView2 from "../../../global/components/refresh/RefreshListView2";
import NavigationBar from "../../../global/navigator/NavigationBar";
import SafeAreaViewPlus from "../../../global/components/SafeAreaViewPlus";
import NavigationUtil from "../../../global/navigator/NavigationUtil";

class FavouriteScreen extends React.Component {

    constructor(props) {
        super(props);
        console.log('FavouriteScreen constructor', this.props);
    }

    componentWillMount() {
        console.log('FavouriteScreen componentWillMount', this.props);
        this.user = this.props.navigation.state.params.user;
        this.props.refreshTimeline(this.user.id)
    }

    componentDidMount() {
        console.log('FavouriteScreen componentDidMount', this.props);
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
        return true
    }

    render() {
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            backPress={this.goBack}
            title={`${this.user.name}的收藏`}
            style={theme.styles.navBar}//颜色遵循主题的
        />;
        console.log("FavouriteScreen render", this.props);
        return <SafeAreaViewPlus backPress={this.goBack}>
            {navigationBar}
            <RefreshListView2
                theme={this.props.theme}
                data={this.props.newBundle ? this.props.newBundle.pageData : []}
                ptrState={this.props.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshTimeline(this.user.id)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreTimeline(this.user.id, this.props.newBundle)
                }}
            />
        </SafeAreaViewPlus>
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
        newBundle: state.favouriteReducer.newBundle,
        ptrState: state.favouriteReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreTimeline: (id, oldPageData) => dispatch(action.loadMoreTimeline(id, oldPageData)),
        refreshTimeline: (id) => dispatch(action.refreshTimeline(id))

    })
)(FavouriteScreen)
