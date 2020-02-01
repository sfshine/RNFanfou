import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import * as action from "./FriendsAction";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import UserCell from "../../home/components/UserCell";
import NavigationUtil from "../../../global/navigator/NavigationUtil";
import NavigationBar from "../../../global/navigator/Navigationbar";
import BackPressHelper from "../../../global/components/BackPressHelper";
import SafeAreaViewPlus from "../../../global/components/SafeAreaViewPlus";

class FriendsScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log('FriendsScreen constructor', this.props);
        this.user = this.props.navigation.state.params.user
        this.isFollowers = this.props.navigation.state.params.isFollowers
        this.state = {
            checkedMap: {},
            showSearchView: false,
        }
        this.backPress = new BackPressHelper({
            backPress: () => {
                NavigationUtil.goBack(this.props)
                return true
            }
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        console.log("FriendsScreen componentWillUnmount")
    }

    componentWillMount() {
        console.log('FriendsScreen componentWillMount', this.props);
        this.props.refreshFriends(this.user.id)
    }

    componentDidMount() {
        console.log('FriendsScreen componentDidMount', this.props);
        this.backPress.componentDidMount();
    }

    render() {
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            title={`${this.user.name}的${this.isFollowers ? "粉丝" : "好友"}`}
            style={theme.styles.navBar}//颜色遵循主题的
            rightButton={this.renderRightButton()}//标题栏右边按钮
            backPress={() => NavigationUtil.goBack(this.props)}
        />;
        console.log("TimelinePage render", this.props);
        return <SafeAreaViewPlus backPress={() => {
            return NavigationUtil.goBack(this.props)
        }}>
            {navigationBar}
            <RefreshListView
                theme={this.props.theme}
                data={this.props.pageData}
                ptrState={this.props.loadState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshFriends(this.user.id)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.user.id, this.props.bundle)
                }}
            />
        </SafeAreaViewPlus>
    }

    renderRightButton() {
        return <View style={{flexDirection: 'row',}}>
            <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.sure}>
                <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        </View>
    }

    sure = () => {
        this.props.navigation.state.params.callback(this.state.checkedMap)
        NavigationUtil.goBack(this.props)
    };
    _renderItem = (data) => {
        let user = data.item;
        return (
            <UserCell showCheckBox={false} user={user} theme={this.props.theme} onPress={() => {
                let tmpMap = this.state.checkedMap;
                if (tmpMap[user.name]) {
                    tmpMap[user.name] = false
                } else {
                    tmpMap[user.name] = true //表示选中, user.name是唯一的
                }
                this.setState({
                    checkedMap: tmpMap
                })
                console.log('点击了Item----' + user.name, this.state.checkedMap);
            }}/>
        )
    };
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        bundle: state.friendsReducer.bundle,
        pageData: state.friendsReducer.bundle ? state.friendsReducer.bundle.data : [],
        loadState: state.friendsReducer.loadState,
    }),
    (dispatch) => ({
        loadMoreFriends: (id, oldPageData) => dispatch(action.loadMoreFriends(id, oldPageData)),
        refreshFriends: (id) => dispatch(action.refreshFriends(id))

    })
)(FriendsScreen)
