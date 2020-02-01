import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import {NAV_BAR_HEIGHT_ANDROID} from "../../global/navigator/Navigationbar";
import RefreshListView2 from "../../global/components/refresh/RefreshListView2";
import TimelineCell from "../timeline/TimelineCell";
import * as action from "./SearchAction";
import CommonViewFactory from "../../global/util/CommonViewFactory";
import NavigationUtil from "../../global/navigator/NavigationUtil";
import SafeAreaViewPlus from "../../global/components/SafeAreaViewPlus";
import RefreshState from "../../global/components/refresh/RefreshState";
import {toast} from "../../global/util/UIUtil";
import EventType from "../common/event/EventType";
import EventBus from "react-native-event-bus";

class SearchScreen extends React.Component {
    static defaultProps = {
        showBottomButton: true
    }

    constructor(props) {
        super(props)
        this.state = {
            inputKey: "",
            queryId: this.props.navigation.state.params.queryId,
        }
    }

    static defaultProps = {
        loadState: RefreshState.NoMoreData,
    }

    componentWillMount() {
        console.log('SearchScreen componentWillMount', this.props);
        let url = this.props.navigation.state.params.url
        let inputKey = ""
        if (url && url.indexOf('/q/') == 0) {
            inputKey = decodeURI(url.substr('/q/'.length, url.length))
            console.log("SearchScreen " + inputKey)
            this.props.search(inputKey)
        }
        this.setState({
            inputKey: inputKey
        })
    }

    render() {
        let theme = this.props.theme
        let navigationBar = this.renderNavBar()
        let bottomButton = <TouchableOpacity
            style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
            onPress={() => {
                if (this.state.queryId) {
                    this.destroyKey();
                } else {
                    this.saveKey();
                }
            }}>
            <Text style={styles.buttonText}>{this.state.queryId ? '取消关注' : '关注话题'}</Text>
        </TouchableOpacity>
        return <SafeAreaViewPlus
            style={{justifyContent: 'space-between'}}
            backPress={this.goBack}>
            {navigationBar}
            <RefreshListView2
                theme={this.props.theme}
                data={this.props.pageData ? this.props.pageData.data : []}
                ptrState={this.props.loadState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.search(this.state.inputKey)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMore(this.state.inputKey, this.props.pageData)
                }}
            />
            {bottomButton}
        </SafeAreaViewPlus>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };

    renderNavBar() {
        const {theme} = this.props;
        const placeholder = "请输入";
        let backButton = CommonViewFactory.getLeftBackButton(this.goBack);
        let inputView =
            <View style={styles.textInputWrapper}>
                <TextInput
                    numberOfLines={1}
                    selectionColor={'#FFFFFF'}
                    ref={el => (this.input = el)}
                    placeholder={placeholder}
                    placeholderTextColor="white"
                    onChangeText={text => {
                        this.setState({inputKey: text, queryId: null})
                    }}
                    style={styles.textInput}
                    value={this.state.inputKey}
                >
                </TextInput>
            </View>;
        let rightButton =
            <TouchableOpacity
                onPress={() => {
                    this.input.blur();//收起键盘
                    if (this.state.inputKey.length > 0) {
                        this.props.search(this.state.inputKey)
                    } else {
                        this.goBack()
                    }
                }}
            >
                <View style={{marginRight: 10}}>
                    <Text style={styles.buttonText}> {this.state.inputKey.length > 0 ? '搜索' : "取消"}</Text>
                </View>
            </TouchableOpacity>;
        return <View style={{
            backgroundColor: theme.themeColor,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: NAV_BAR_HEIGHT_ANDROID,
        }}>
            {backButton}
            {inputView}
            {rightButton}
        </View>
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
        this.props.search_cancel()
        return true
    }

    destroyKey() {
        action.destroySearchWord(this.state.queryId).then(json => {
            toast("取消成功")
            this.setState({
                queryId: null
            })
            EventBus.getInstance().fireEvent(EventType.refreshKeywords, {isCreate: false})
        }).catch(e => {
            console.log("createSearchWord error:", e)
        })
    }

    saveKey() {
        action.createSearchWord(this.state.inputKey).then(json => {
            toast("关注话题成功")
            this.setState({
                queryId: json.id
            })
            EventBus.getInstance().fireEvent(EventType.refreshKeywords, {isCreate: true})
        }).catch(e => {
            console.log("createSearchWord error:", e)
        })
    }
}

const styles = StyleSheet.create({

    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        padding: 0,
        color: 'white',
        textAlign: 'left',
        textAlignVertical: 'center'
    },
    textInputWrapper: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        flex: 1,
        margin: 5,
    },
    bottomButton: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
        height: 40,
        borderRadius: 3,
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.searchReducer.pageData,
        loadState: state.searchReducer.loadState
    }),
    (dispatch) => ({
        search_cancel: () => dispatch(action.search_cancel()),
        loadMore: (text, oldPageData) => dispatch(action.loadMore(text, oldPageData)),
        search: (text) => dispatch(action.search(text))
    })
)(SearchScreen)
