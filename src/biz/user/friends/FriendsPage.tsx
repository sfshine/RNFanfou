import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from "react-redux";
import FriendsAction from "./FriendsAction";
import UserCell from "~/biz/compose/UserCell";
import PageCmpt from "~/global/components/PageCmpt";
import RefreshListViewFlickr from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";
import {navigate} from "~/global/navigator/NavigationManager";

interface Props extends BaseProps {
    refreshFriends: Function,
    loadMoreFriends: Function,
    pageData: [],
    ptrState: string,
}

const action = new FriendsAction()

class FriendsPage extends PureComponent<Props> {
    private readonly user: any;
    private readonly isFollowers: boolean;

    constructor(props) {
        super(props);
        console.log('FriendsPage constructor', this.props);
        this.user = this.props.navigation.state.params.user
        this.isFollowers = this.props.navigation.state.params.isFollowers
    }

    componentWillMount() {
        console.log('FriendsPage componentWillMount', this.props);
        this.props.refreshFriends(this.user.id)
    }

    render() {
        console.log("TimelinePage render", this.props);
        return <PageCmpt title={`${this.user.name}的${this.isFollowers ? "粉丝" : "关注"}`} backNav={this.props.navigation}>
            <RefreshListViewFlickr
                data={this.props.pageData}
                ptrState={this.props.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshFriends(this.user.id)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.user.id, this.props.pageData)
                }}
            />
        </PageCmpt>
    }

    _renderItem = (data) => {
        return (<UserCell user={data.item} onPress={() => navigate(this.props, "ProfilePage", {user: data.item})}/>)
    }
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.FriendsReducer.actionData,
        ptrState: state.FriendsReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreFriends: (id, oldPageData) => dispatch(action.loadMoreFriends(id, oldPageData)),
        refreshFriends: (id) => dispatch(action.refreshFriends(id))
    })
)(FriendsPage)
