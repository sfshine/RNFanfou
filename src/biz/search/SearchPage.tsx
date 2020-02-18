import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import {NAV_BAR_HEIGHT_ANDROID} from "../../global/navigator/NavigationBar";
import RefreshListViewFlickr from "../../global/components/refresh/RefreshListViewFlickr";
import TimelineCell from "../timeline/TimelineCell";
import SafeAreaViewPlus from "../../global/components/SafeAreaViewPlus";
import BaseProps from "~/global/base/BaseProps";
import {goBack} from "~/global/navigator/NavigationManager";
import TipsUtil from "~/global/util/TipsUtil";
import NavigationBarViewFactory from "~/global/navigator/NavigationBarViewFactory";
import {SearchAction} from "./SearchAction";
import RefreshState from "~/global/components/refresh/RefreshState";
import Ionicons from 'react-native-vector-icons/Ionicons'
import {SEARCH_ACTIONS} from "~/biz/search/SearchReducer";

interface State {
    queryId: string,
    inputKey: string,
}

interface Props extends BaseProps {
    search: Function,
    loadMore: Function,
    search_cancel: Function,
    getSearchWordList: Function,
    pageData: [],
    ptrState: string,
}

const action = new SearchAction()

class SearchPage extends React.Component<Props, State> {
    static defaultProps = {
        showBottomButton: true,
        ptrState: RefreshState.Init,
    }
    private input: any;

    constructor(props) {
        super(props)
        this.state = {
            inputKey: "",
            queryId: this.props.navigation.state.params.queryId,
        }
    }

    goBack = () => goBack(this.props)

    componentWillUnmount(): void {
        this.props.search_cancel()
    }

    componentWillMount() {
        console.log('SearchPage componentWillMount', this.state);
        let url = this.props.navigation.state.params.url
        let inputKey = ""
        if (url && url.indexOf('/q/') == 0) {
            inputKey = decodeURI(url.substr('/q/'.length, url.length))
            console.log("SearchPage " + inputKey)
            this.props.search(inputKey)
        }
        this.setState({
            inputKey: inputKey
        })
    }

    render() {
        let {theme, pageData, ptrState} = this.props
        let listData = pageData ? pageData : []

        let bottomButton = listData && listData.length > 0 && <TouchableOpacity
            style={[styles.bottomButton, {backgroundColor: theme.brand_primary}]}
            onPress={() => {
                if (this.state.queryId) {
                    this.destroyKey();
                } else {
                    this.saveKey();
                }
            }}>
            <Ionicons name={this.state.queryId ? "md-trash" : "md-add"} size={24} style={{color: 'white'}}/>
        </TouchableOpacity>
        let navigationBar = this.renderNavBar()
        return <SafeAreaViewPlus
            style={{justifyContent: 'space-between'}}
            backPress={() => this.goBack()}>
            {navigationBar}
            <RefreshListViewFlickr
                data={listData}
                ptrState={ptrState}
                renderItem={this._renderItem}
                ListEmptyComponent={<View/>}
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

    _renderItem = (data) => <TimelineCell item={data.item}/>

    renderNavBar() {
        const {theme} = this.props;
        const placeholder = "请输入";
        let backButton = NavigationBarViewFactory.createButton(
            {
                icon: "md-arrow-back",
                callback: () => this.goBack()
            });
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
            backgroundColor: theme.brand_primary,
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


    destroyKey() {
        let loading = TipsUtil.toastLoading("删除话题中")
        SearchAction.destroySearchWord(this.state.queryId).then(json => {
            this.setState({
                queryId: null
            })
            this.props.getSearchWordList()
            TipsUtil.toastSuccess("删除话题成功", loading)
        }).catch(e => {
            console.log("createSearchWord error:", e)
            TipsUtil.toastFail("删除话题失败", loading)
        })
    }

    saveKey() {
        let loading = TipsUtil.toastLoading("关注话题中")
        SearchAction.createSearchWord(this.state.inputKey).then(json => {
            this.setState({
                queryId: json.id
            })
            this.props.getSearchWordList()
            TipsUtil.toastSuccess("关注话题成功", loading)
        }).catch(e => {
            console.log("createSearchWord error:", e)
            TipsUtil.toastFail("关注话题失败", loading)
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
        shadowRadius: 8,
        shadowColor: '#aaaaaa',
        shadowOpacity: 0.6,
        shadowOffset: {width: 0, height: 3},

        borderRadius: 22,
        width: 45,
        height: 45,
        zIndex: 100,

        position: 'absolute',
        bottom: 8,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.SearchReducer.pageData,
        ptrState: state.SearchReducer.ptrState
    }),
    (dispatch) => ({
        search_cancel: () => dispatch(SEARCH_ACTIONS.SEARCH_CANCEL()),
        loadMore: (text, oldPageData) => dispatch(action.loadMore(text, oldPageData)),
        search: (text) => dispatch(action.search(text)),
        getSearchWordList: () => dispatch(SearchAction.getSearchWordList()),
    })
)(SearchPage)
