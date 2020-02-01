import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import * as action from "./MentionAction";
import RefreshListView from "../../../../global/components/refresh/RefreshListView";
import UserCell from "../../components/UserCell";
import CommonViewFactory from "../../../../global/util/CommonViewFactory";
import NavigationUtil from "../../../../global/navigator/NavigationUtil";
import NavigationBar from "../../../../global/navigator/Navigationbar";
import BackPressHelper from "../../../../global/components/BackPressHelper";
import MentionSearchScreen from "./MentionSearchScreen";
import SafeAreaViewPlus from "../../../../global/components/SafeAreaViewPlus";

class MentionScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log('MentionScreen constructor', this.props);
        // let selectNames = this.props.navigation.state.params.selectNames
        // let words = selectNames.split(',')
        // let tmpMap = {}
        // for (var index in words) {
        //     let word = words[index]
        //     if (index == 0) {
        //         word = word.substr(word.indexOf('@'), word.length)//做个简单处理
        //     }
        //     if (word.startsWith('@')) {
        //         tmpMap[word.replace('@', '')] = true
        //     }
        // }
        // console.log("MentionScreen tmpMap", tmpMap)
        this.state = {
            checkedMap: {},
            showSearchView: false,
        }
        //QuickComposeComponen获取了back的焦点,所以这个页面也得通过BackPressComponent获取焦点了.
        this.backPress = new BackPressHelper({
            backPress: () => {
                NavigationUtil.goBack(this.props)
                return true
            }
        });
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        console.log("MentionScreen componentWillUnmount")
    }

    componentWillMount() {
        console.log('MentionScreen componentWillMount', this.props);
        this.props.refreshFriends()
    }

    componentDidMount() {
        console.log('MentionScreen componentDidMount', this.props);
        this.backPress.componentDidMount();
    }

    render() {
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            title={"选择好友"}
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
                data={this.props.pageData ? this.props.pageData.data : {}}
                ptrState={this.props.loadState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshFriends()
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.props.pageData)
                }}
            />
            {/*{this.state.showSearchView ? <MentionSearchScreen onChooseMentions={this.onChooseMentions}/> : null}*/}
        </SafeAreaViewPlus>
    }

    // onChooseMentions = (checkedMap) => {
    //     if (!checkedMap) return
    //     let names = ''
    //     Object.keys(checkedMap).forEach(function (name) {
    //         if (checkedMap[name]) {
    //             names += "@" + name + " "
    //         }
    //     });
    //     //TODO toast
    //     let newMap = {...this.state.checkedMap, ...checkedMap}
    //     this.setState({
    //         checkedMap: newMap,
    //         showSearchView: false
    //     })
    // }

    renderRightButton() {
        return <View style={{flexDirection: 'row',}}>
            {/*<TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7}*/}
            {/*onPress={() => this.setState({showSearchView: true})}>*/}
            {/*<Text style={styles.buttonText}>搜索</Text>*/}
            {/*</TouchableOpacity>*/}
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
            <UserCell checkMap={this.state.checkedMap} user={user} theme={this.props.theme} onPress={() => {
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
        pageData: state.mentionReducer.pageData,
        loadState: state.mentionReducer.loadState,
    }),
    (dispatch) => ({
        loadMoreFriends: (oldPageData) => dispatch(action.loadMoreFriends(oldPageData)),
        refreshFriends: () => dispatch(action.refreshFriends())

    })
)(MentionScreen)