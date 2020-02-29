import {connect} from "react-redux";
import * as React from "react";
import {GlobalCache} from "~/global/AppGlobal";
import PageCmpt from "~/global/components/PageCmpt";
import {Image, ImageBackground, ScrollView, StyleSheet, Text} from "react-native";
import {List, Modal} from "@ant-design/react-native";
import Item from "@ant-design/react-native/es/list/ListItem";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import BaseProps from "~/global/base/BaseProps";
import LoginAction from "~/biz/user/login/LoginAction";

interface Props extends BaseProps {
    logout: Function,
}

interface State {
}

class MeFragment extends React.PureComponent<Props, State> {

    render() {
        return <PageCmpt title={" "} rightNavButtonConfig={
            {
                text: "退出",
                callback: this.confirmLogout
            }
        }>
            {this.renderContent()}
        </PageCmpt>
    }

    private confirmLogout = () => {
        Modal.alert('确认', '退出当前账号?', [
            {
                text: '取消',
                onPress: () => console.log('cancel'),
                style: 'cancel',
            },
            {text: '确定', onPress: () => this.props.logout(NavigationManager.mainNavigation)},
        ]);
    }

    private renderContent() {
        let user = GlobalCache.user
        return <ScrollView
            style={{flex: 1, backgroundColor: '#f5f5f9'}}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            <ImageBackground source={{uri: user.profile_background_image_url}} style={styles.profile}>
                <Image style={styles.avatar} source={{uri: user.profile_image_url_large}}/>
                <Text style={styles.profile_description}>{user.name}</Text>
                {user.url ? <Text style={styles.profile_description}> {user.url}</Text> : null}
                <Text style={styles.profile_description}>{user.description}</Text>
            </ImageBackground>
            <List>
                <Item extra={user.statuses_count} arrow="horizontal" onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "ProfilePage", {user: user})
                }}>状态
                </Item>
                <Item extra={user.photo_count} arrow="horizontal" onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "GalleryPage", {user: user})
                }}>照片
                </Item>
                <Item extra={user.favourites_count} arrow="horizontal" onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "FavouritePage", {user: user})
                }}>收藏
                </Item>
                <Item extra={user.friends_count} arrow="horizontal" onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "FriendsPage", {user: user, isFollowers: false})
                }}>关注
                </Item>
                <Item extra={user.followers_count} arrow="horizontal" onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "FriendsPage", {user: user, isFollowers: true})
                }}>粉丝
                </Item>
            </List>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    avatar: {
        height: 80,
        width: 80,
    },
    profile: {
        paddingTop: 10,
        alignItems: 'center',
    },
    profile_description: {
        marginTop: 5,
        textAlign: 'center',
        color: 'black',
        textShadowRadius: 4,
        textShadowColor: 'white'
    },
})
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({
        logout: (navigation) => dispatch(LoginAction.logout(navigation))

    })
)
(MeFragment)
