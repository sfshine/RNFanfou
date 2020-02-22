import * as React from 'react';
import {PureComponent} from 'react';
import {connect} from "react-redux";
import FriendsAction from "./FriendsAction";
import UserCell from "~/biz/compose/UserCell";
import PageCmpt from "~/global/components/PageCmpt";
import RefreshListView from "~/global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";

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
        return <PageCmpt title={`${this.user.name}的${this.isFollowers ? "粉丝" : "好友"}`} backNav={this.props.navigation}>
            <RefreshListView
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
        let user = data.item;
        return (<UserCell showCheckBox={false} user={user} theme={this.props.theme}/>)
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
