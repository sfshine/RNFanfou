import React from 'react';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import MentionSearchAction from "./MentionSearchAction";
import RefreshListView from "~/global/components/refresh/RefreshListViewFlickr";
import PageCmpt from "~/global/components/PageCmpt";
import UserCell from "../../UserCell";
import BaseProps from "~/global/base/BaseProps";
import ArchModal from "~/global/util/ArchModal";
import NavigationBarViewFactory from "~/global/navigator/NavigationBarViewFactory";
import {NAV_BAR_HEIGHT_ANDROID} from "~/global/navigator/NavigationBar";
import BackPressComponent from "~/global/components/BackPressComponent";

interface Props extends BaseProps {
    searchUsersLoadMore: Function,
    searchUsers: Function,
    pageData: [],
    ptrState: string,
    searchCallback: Function,
    modal: ArchModal,
    theme: any,
}

interface State {
    checkedMap: object,
    inputKey: string,
}

class MentionSearchPage extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            checkedMap: {},
            inputKey: ''
        }
    }

    dismiss = () => {
        this.props.modal.remove()
        return true
    }

    render() {
        let navigationBar = this.renderNavBar()
        return <PageCmpt>
            <BackPressComponent backPress={this.dismiss}/>
            {navigationBar}
            <RefreshListView
                data={this.props.pageData ? this.props.pageData : []}
                ptrState={this.props.ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.searchUsers(this.state.inputKey)
                }}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.searchUsersLoadMore(this.state.inputKey, this.props.pageData)
                }}
            />
        </PageCmpt>
    }

    renderNavBar() {
        const {theme} = this.props;
        const placeholder = "请输入";
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
        let rightButton = NavigationBarViewFactory.createButton({
            icon: Object.keys(this.state.checkedMap).length > 0 ? "check" : "close",
            callback: this.sure
        })
        return <View style={{
            backgroundColor: theme.brand_primary,
            flexDirection: 'row',
            alignItems: 'center',
            height: NAV_BAR_HEIGHT_ANDROID,
        }}>
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
            }}/>
        )
    };

    sure() {
        this.props.searchCallback(this.state.checkedMap)
        this.props.modal.remove()
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

const action = new MentionSearchAction()
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.MentionReducer.pageData,
        ptrState: state.MentionReducer.ptrState,
    }),
    (dispatch) => ({
        searchUsers: (text) => dispatch(action.searchUsers(text)),
        searchUsersLoadMore: (text, oldPageData) => dispatch(action.searchUsersLoadMore(text, oldPageData)),
    })
)(MentionSearchPage)
