import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import TimelineCell from "../../timeline/TimelineCell";
import RefreshState from "../../../global/components/refresh/RefreshState";
import PageCmpt from "~/global/components/PageCmpt";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import Logger from "~/global/util/Logger";
import {navigate} from "~/global/navigator/NavigationManager";
import {FanfouUtil} from '~/biz/common/util/FanfouUtil';
import BaseProps from "~/global/base/BaseProps";
import ProfileAction from "~/biz/user/profile/ProfileAction";
import {USER_PROFILE_ACTIONS} from "~/biz/user/profile/ProfileReducer";

interface State {
    user: any,
    pageData: Array<any>,
    ptrState: string,
}

const TAG = "ProfilePage"
/**
 * 进入ProfilePage有两种方式
 * 1.点击用户头像,此时this.props.navigation.state.params.user不是空
 * 2.点击url,此时this.props.navigation.state.params.url非空,此时需要调用Api.users_show接口获取user信息
 */
export default class ProfilePage extends React.Component<BaseProps, State> {
    private readonly url
    private mProfileAction = new ProfileAction()

    constructor(props) {
        super(props)
        Logger.log(TAG, 'constructor', this.props);
        let {user, url} = this.props.navigation.state.params;
        this.url = url
        this.state = {
            user: user,
            pageData: [],
            ptrState: RefreshState.Idle,
        };
    }

    componentWillMount() {
        let url = this.url
        if (this.state.user) {
            this.onRefreshTimeline();
            Logger.log(TAG, "refreshUserTimeline now!!!")//测试发现setState以后这里不会重复执行也就是state [props变化后render会触发执行.
        } else if (url) {
            Logger.log(TAG, 'componentWillMount:', url);
            /*<a href="http://fanfou.com/dailu321" className="former">*/
            if (FanfouUtil.isProfileUrl(url)) {
                let userId = url.substr(url.indexOf('com/') + 4, url.length)
                FanfouFetch.get(Api.users_show, {id: userId}).then(user => {
                    this.setState({
                        user: user,
                    })
                    this.onRefreshTimeline();
                }).catch(e => {
                    Logger.log(TAG, "获取用户信息失败")
                })
            }
        }
    }

    render() {
        let user = this.state.user
        return <PageCmpt title={user ? user.name : "加载中..."} backNav={this.props.navigation}>
            {user ? <RefreshListView
                ListHeaderComponent={this._renderHeader}
                data={this.state.pageData}
                ptrState={this.state.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    Logger.log(TAG, "onHeaderRefresh");
                    this.onRefreshTimeline();
                }}
                onFooterRefresh={() => {
                    Logger.log(TAG, "onFooterRefresh");
                    this.onLoadMoreTimeline()
                }}
            /> : null}
        </PageCmpt>
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
                    navigate(this.props, "FavouriteScreen", {user: this.state.user})
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
                    navigate(this.props, "FriendsScreen", {user: this.state.user, isFollowers: false})
                }}>
                    <Text style={styles.profile_number_cell_num}>
                        {user.friends_count}
                    </Text>
                    <Text style={styles.profile_number_cell_name}>
                        关注
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profile_number_cell} onPress={() => {
                    navigate(this.props, "FriendsScreen", {user: this.state.user, isFollowers: true})
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
        // Logger.log(TAG,"data", data)
        let item = data.item;
        return (
            <TimelineCell item={item} onPress={() => {
                Logger.log(TAG, '点击了Item----' + item.title);
            }}/>
        )
    };

    onStateChange = (action) => {
        // Logger.log(TAG, "action", action)
        let pageData = this.state.pageData
        switch (action.ptrState) {
            case RefreshState.Idle:
            case RefreshState.LoadingMoreEnd:
                pageData = action.actionData
                break;
            default:
                break;
        }
        this.setState({
            ptrState: action.ptrState,
            pageData: pageData,
        })
    }

    onRefreshTimeline = () => {
        if (this.state.user) {
            this.mProfileAction.refreshUserTimeline(this.state.user.id, (action) => {
                this.onStateChange(action)
            }).then()
        } else {
            Logger.error(TAG, "user is empty, cannot onRefreshTimeline")
        }
    }

    onLoadMoreTimeline = () => {
        if (this.state.user) {
            this.mProfileAction.loadMoreUserTimeline(this.state.user.id, (this.state.pageData), (action) => {
                this.onStateChange(action)
            }).then()
        } else {
            Logger.error(TAG, "user is empty, cannot onRefreshTimeline")
        }
    }

    // renderRightButton() {
    //     return <View style={{flexDirection: 'row',}}>
    //         <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.operateFriendShip}>
    //             <Text style={styles.buttonText}>{this.state.following ? "取关" : "关注"}</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.logoutAction}>
    //             <Text style={styles.buttonText}>私信</Text>
    //         </TouchableOpacity>
    //     </View>
    // }
    //
    // operateFriendShip = () => {
    //     let following = this.state.following
    //     following ? Toast.show("取消关注中...", 2, false) : Toast.show("关注中...", 2, false)
    //     let url = following ? friendships_destroy() : friendships_create()
    //     FanfouFetch.post(url, {id: this.state.user.id}).then(user => {
    //         Logger.log(TAG, "operateFriendShip:" + user)
    //         following ? Toast.success("取关成功", 2, false) : Toast.success("关注成功", 2, false)
    //         if (user) {
    //             this.setState({
    //                 following: !following
    //             })
    //         }
    //     }).catch(e => {
    //         Logger.log(TAG, "取关/关注操作失败:", e)
    //         Toast.fail("操作失败", 2, false)
    //     })
    // }
}

const styles = StyleSheet.create({
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
