import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../../global/navigator/Navigationbar";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import TimelineCell from "../../home/TimelineCell";
import * as action from "./ProfileAction";
import NavigationUtil from "../../../global/navigator/NavigationUtil";
import QuickComposeComponent from "../../home/compose/QuickComposeComponent";
import FanfouFetch from "../../../global/network/FanfouFetch";
import {friendships_create, friendships_destroy, users_show} from "../../../global/network/Api";
import {Toast} from 'antd-mobile-rn';
import SafeAreaViewPlus from "../../../global/components/SafeAreaViewPlus";
import RefreshState from "../../../global/components/refresh/RefreshState";

class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)
        console.log('ProfileScreen constructor', this);
        let user = this.props.navigation.state.params.user;
        this.url = this.props.navigation.state.params.url;
        this.state = {
            user: user,
            following: user ? user.following : false,
            pageData: null,
            loadState: RefreshState.Idle,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
        return true
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("ProfileScreen shouldComponentUpdate state:", this.state)
        console.log("ProfileScreen nextProps:", nextProps)
        // console.log("ProfileScreen nextState:", nextState)
        let user = this.state.user
        if (user && nextProps.userId == user.id) {
            if ((nextProps.loadState !== this.state.loadState)
                || JSON.stringify(nextProps.pageData) !== JSON.stringify(this.state.pageData)) {
                this.setState({
                    pageData: nextProps.pageData,
                    loadState: nextProps.loadState
                })
                return false
            }
        }
        return true
    }

    componentWillUnmount() {
        console.log("ProfileScreen componentWillUnmount")
    }

    componentDidMount() {
        console.log('ProfileScreen componentDidMount', this.props);
        this.props.navigation.addListener('willFocus', this.willFocus)
        this.props.navigation.addListener('willBlur', this.willBlur)
    }

    willFocus = () => {
        console.log("ProfileScreen willFocus")
        this.isFocus = true
    }
    willBlur = () => {
        console.log("ProfileScreen willBlur ")
        this.isFocus = false
    }

    componentWillMount() {
        let url = this.url
        if (this.state.user) {
            this.props.refreshUserTimeline(this.state.user.id)
            console.log("refreshUserTimeline at 27!!!")//测试发现setState以后这里不会重复执行也就是state [props变化后render会触发执行.
        } else if (url) {
            console.log('componentWillMount' + url);
            /*<a href="http://fanfou.com/dailu321" className="former">*/
            if (url.includes("http://fanfou.com/")) {
                let userId = url.substr(url.indexOf('com/') + 4, url.length)
                FanfouFetch.get(users_show(), {id: userId}).then(user => {
                    this.setState({
                        user: user,
                        following: user.following,
                    })
                    this.props.refreshUserTimeline(this.state.user.id)
                }).catch(e => {
                    console.log("获取用户信息失败")
                })
            }
        }
    }

    render() {
        let user = this.state.user
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            backPress={this.goBack}
            title={user ? user.name : "加载中..."}
            style={theme.styles.navBar}//颜色遵循主题的
            rightButton={this.renderRightButton()}//标题栏右边按钮
        />;
        return <SafeAreaViewPlus backPress={this.goBack}>
            {navigationBar}
            <QuickComposeComponent isFocus={this.isFocus}/>
            {user ? <RefreshListView
                ListHeaderComponent={this._renderHeader}
                theme={this.props.theme}
                data={this.state.pageData ? this.state.pageData.data : []}
                ptrState={this.state.loadState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshUserTimeline(user.id)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreUserTimeline(user.id, (this.props.pageData ? this.props.pageData : []))
                }}
            /> : null}
        </SafeAreaViewPlus>
    }

    _renderHeader = () => {
        let user = this.state.user;
        return <ImageBackground source={{uri: user.profile_background_image_url}} style={styles.profile}>
            <Image style={styles.avatar} source={{uri: user.profile_image_url_large}}/>
            {user.url ? <Text style={styles.profile_description}> {user.url}</Text> : null}
            <Text style={styles.profile_description}>{user.description}</Text>
            <View style={styles.profile_numbers}>
                <View style={styles.profile_number_cell}>
                    <Text style={styles.profile_number_cell_num}>
                        {user.statuses_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        消息
                    </Text>
                </View>
                <View style={styles.profile_number_cell}>
                    <Text style={styles.profile_number_cell_num}>
                        {user.photo_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        照片
                    </Text>
                </View>
                <TouchableOpacity style={styles.profile_number_cell} onPress={() => {
                    NavigationUtil.navigate(this.props, "FavouriteScreen", {user: this.state.user})
                }
                }>
                    <Text style={styles.profile_number_cell_num}>
                        {user.favourites_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        收藏
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profile_number_cell} onPress={() => {
                    NavigationUtil.navigate(this.props, "FriendsScreen", {user: this.state.user, isFollowers: false})
                }}>
                    <Text style={styles.profile_number_cell_num}>
                        {user.friends_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        关注
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profile_number_cell} onPress={() => {
                    NavigationUtil.navigate(this.props, "FriendsScreen", {user: this.state.user, isFollowers: true})
                }}>
                    <Text style={styles.profile_number_cell_num}>
                        {user.followers_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        粉丝
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    }

    _renderItem = (data) => {
        // console.log("data", data)
        let item = data.item;
        return (
            <TimelineCell item={item} onPress={() => {
                console.log('点击了Item----' + item.title);
            }}/>
        )
    };

    renderRightButton() {
        return <View style={{flexDirection: 'row',}}>
            <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.operateFriendShip}>
                <Text style={styles.buttonText}>{this.state.following ? "取关" : "关注"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.logoutAction}>
                <Text style={styles.buttonText}>私信</Text>
            </TouchableOpacity>
        </View>
    }

    operateFriendShip = () => {
        let following = this.state.following
        following ? Toast.show("取消关注中...", 2, false) : Toast.show("关注中...", 2, false)
        let url = following ? friendships_destroy() : friendships_create()
        FanfouFetch.post(url, {id: this.state.user.id}).then(user => {
            console.log("operateFriendShip:" + user)
            following ? Toast.success("取关成功", 2, false) : Toast.success("关注成功", 2, false)
            if (user) {
                this.setState({
                    following: !following
                })
            }
        }).catch(e => {
            console.log("取关/关注操作失败:", e)
            Toast.fail("操作失败", 2, false)
        })
    }
}

const
    styles = StyleSheet.create({
        buttonText: {
            fontSize: 17,
            fontWeight: 'bold',
            color: 'white'
        },
        profile: {
            paddingTop: 10,
            alignItems: 'center',
        },
        avatar: {
            height: 80,
            width: 80,
        },
        profile_right: {
            flex: 1,
        },
        profile_numbers: {
            padding: 5,
            width: '100%',
            marginTop: 10,
            backgroundColor: '#FFFFFF',
            alignItems: "center",
            justifyContent: 'space-around',
            flexDirection: 'row',
        },
        profile_number_cell: {},
        profile_number_cell_num: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold',
        },
        profile_number_cell_name: {
            textAlign: 'center',
            fontSize: 13,
        },

        profile_description: {
            marginTop: 5,
            textAlign: 'center',
            color: 'black',
            textShadowRadius: 4,
            textShadowColor: 'white'
        },

    });

export default connect(
    (state) => ({
            theme: state.themeReducer.theme,
            pageData: state.profileReducer.pageData,
            loadState: state.profileReducer.loadState,
            userId: state.profileReducer.userId,
        }
    ),
    (dispatch) => ({
        loadMoreUserTimeline: (userId, oldPageData) => dispatch(action.loadMoreUserTimeline(userId, oldPageData)),
        refreshUserTimeline: (userId) => dispatch(action.refreshUserTimeline(userId))
    })
)(ProfileScreen)
