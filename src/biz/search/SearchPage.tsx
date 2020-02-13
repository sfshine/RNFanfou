import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import {NAV_BAR_HEIGHT_ANDROID} from "../../global/navigator/NavigationBar";
import RefreshListView from "../../global/components/refresh/RefreshListView";
import TimelineCell from "../timeline/TimelineCell";
import SafeAreaViewPlus from "../../global/components/SafeAreaViewPlus";
import BaseProps from "~/global/base/BaseProps";
import {goBack} from "~/global/navigator/NavigationManager";
import TipsUtil from "~/global/util/TipsUtil";
import NavigationBarViewFactory from "~/global/navigator/NavigationBarViewFactory";
import {SearchAction} from "./SearchAction";
import RefreshState from "~/global/components/refresh/RefreshState";

interface State {
    queryId: string,
    inputKey: string,
}

interface Props extends BaseProps {
    search: Function,
    loadMore: Function,
    search_cancel: Function,
    getSearchWordList: Function,
    pageData: any,
    ptrState: string,
}

const action = new SearchAction()

class SearchPage extends React.Component<Props, State> {
    static defaultProps = {
        showBottomButton: true,
        ptrState: RefreshState.Idle,
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
        console.log('SearchPage componentWillMount', this.props);
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
        let theme = this.props.theme
        let navigationBar = this.renderNavBar()
        let bottomButton = <TouchableOpacity
            style={[styles.bottomButton, {backgroundColor: theme.brand_primary}]}
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
            backPress={() => this.goBack()}>
            {navigationBar}
            <RefreshListView
                data={this.props.pageData ? this.props.pageData.data : []}
                ptrState={this.props.ptrState}
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
        SearchAction.destroySearchWord(this.state.queryId).then(json => {
            TipsUtil.toast("取消成功")
            this.setState({
                queryId: null
            })
            this.props.getSearchWordList()
        }).catch(e => {
            console.log("createSearchWord error:", e)
        })
    }

    saveKey() {
        SearchAction.createSearchWord(this.state.inputKey).then(json => {
            TipsUtil.toast("关注话题成功")
            this.setState({
                queryId: json.id
            })
            this.props.getSearchWordList()
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
        pageData: state.SearchReducer.pageData,
        ptrState: state.SearchReducer.ptrState
    }),
    (dispatch) => ({
        search_cancel: () => dispatch(SearchAction.search_cancel()),
        loadMore: (text, oldPageData) => dispatch(action.loadMore(text, oldPageData)),
        search: (text) => dispatch(action.search(text)),
        getSearchWordList: () => dispatch(SearchAction.getSearchWordList()),
    })
)(SearchPage)
