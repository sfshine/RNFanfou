import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../global/navigator/Navigationbar";
import RefreshListView from "../../global/components/refresh/RefreshListView";
import TimelineCell from "../timeline/TimelineCell";
import * as action from "../user/profile/ProfileAction";

class ProfileScreen extends React.Component {
    user = {}

    componentWillMount() {
        console.log('HomeScreen componentWillMount', this.props);
        this.user = this.props.navigation.state.params.user;
        this.props.refreshUserTimeline()
    }

    render() {
        const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar//app标题栏
            title={this.user.name}
            statusBar={statusBar}//状态栏配置
            style={theme.styles.navBar}//颜色遵循主题的
            rightButton={this.renderRightButton()}//标题栏右边按钮
        />;
        return <View style={styles.container}>
            {navigationBar}
            <RefreshListView
                ListHeaderComponent={this._renderHeader}
                theme={this.props.theme}
                data={this.props.pageData ? this.props.pageData.data : []}
                ptrState={this.props.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                stickyHeaderIndices={[1]}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshUserTimeline(this.user.id)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreUserTimeline(this.user.id, this.props.pageData)
                }}
            />
        </View>
    }

    _renderHeader = () => {
        return <Text style={{backgroundColor: "white", height: 200}}>Header</Text>
    }
    _renderItem = (data) => {
        console.log("data", data)
        let item = data.item;
        return (
            <TimelineCell item={item} onPress={() => {
                console.log('点击了Item----' + item.title);
            }}/>
        )

    };

    renderRightButton() {
        return <View style={{flexDirection: 'row',}}>
            <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.logoutAction}>
                <Text style={styles.buttonText}>{this.user.following ? "取关" : "关注"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={this.logoutAction}>
                <Text style={styles.buttonText}>私信</Text>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.profileReducer.pageData,
        ptrState: state.profileReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreUserTimeline: (userId, oldPageData) => dispatch(action.loadMoreUserTimeline(userId, oldPageData)),
        refreshUserTimeline: (userId) => dispatch(action.refreshUserTimeline(userId))
    })
)(ProfileScreen)
