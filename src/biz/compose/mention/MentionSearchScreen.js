import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import * as action from "./MentionAction";
import RefreshListView from "../../../global/components/refresh/RefreshListView";
import UserCell from "../UserCell";
import CommonViewFactory from "../../../global/util/CommonViewFactory";
import {NAV_BAR_HEIGHT_ANDROID} from "../../../../global/navigator/Navigationbar";
import RefreshState from "../../../global/components/refresh/RefreshState";
import SafeAreaViewPlus from "../../../global/components/SafeAreaViewPlus";
import NavigationUtil from "../../../../global/navigator/NavigationUtil";

class MentionSearchScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log('MentionSearchScreen constructor', this.props);
        this.state = {
            checkedMap: {},
            inputKey: ''
        }
    }

    static defaultProps = {
        searchptrState: RefreshState.NoMoreData,
    }

    componentWillUnmount() {
        console.log("MentionSearchScreen componentWillUnmount")
    }

    componentWillMount() {
        console.log('MentionSearchScreen componentWillMount', this.props);
    }

    componentDidMount() {
        console.log('MentionSearchScreen componentDidMount', this.props);
    }

    render() {
        let navigationBar = this.renderNavBar()
        return <SafeAreaViewPlus backPress={() => {
            return NavigationUtil.goBack(this.props)
        }}>
            {navigationBar}
            <RefreshListView
                theme={this.props.theme}
                data={this.props.pageData ? this.props.pageData.data : {}}
                ptrState={this.props.searchptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.searchUsers(this.state.inputKey)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.searchUsersLoadMore(this.state.inputKey, this.props.searchPageData)
                }}
            /></SafeAreaViewPlus>
    }

    renderNavBar() {
        const {theme} = this.props;
        const placeholder = "请输入";
        let backButton = CommonViewFactory.getLeftBackButton(() => this.props.onChooseMentions(null));
        let inputView =
            <TextInput
                ref="input"
                placeholder={placeholder}
                placeholderTextColor="white"
                onChangeText={text => {
                    this.setState({inputKey: text})
                    this.props.searchUsers(text)
                }}
                style={styles.textInput}
                value={this.state.inputKey}
            >
            </TextInput>;
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.refs.input.blur();//收起键盘
                    this.onRightButtonClick();
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.buttonText}> {this.state.inputKey.length > 0 ? 'OK' : "取消"}</Text>
                </View>
            </TouchableOpacity>;
        return <View style={{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            height: NAV_BAR_HEIGHT_ANDROID,
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    _renderItem = (data) => {
        let user = data.item;
        return (
            <UserCell checkMap={this.state.checkedMap} user={user} theme={this.props.theme} onPress={() => {
                let tmpMap = this.state.checkedMap;
                if (tmpMap[user.name]) {
                    tmpMap[user.name] = false
                } else {
                    tmpMap[user.name] = true
                }
                this.setState({
                    checkedMap: tmpMap
                })
                console.log('点击了Item----' + user.name, this.state.checkedMap);
            }}/>
        )
    };

    onRightButtonClick() {
        this.sure();
    }

    sure() {
        this.props.onChooseMentions(this.state.checkedMap)
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    textInput: {
        flex: 1,
        height: 36,
        borderColor: "white",
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white'
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        searchPageData: state.mentionReducer.searchPageData,
        searchptrState: state.mentionReducer.searchptrState,
    }),
    (dispatch) => ({
        searchUsersLoadMore: (text, oldPageData) => dispatch(action.searchUsersLoadMore(text, oldPageData)),
        searchUsers: (text) => dispatch(action.searchUsers(text))
    })
)(MentionSearchScreen)
