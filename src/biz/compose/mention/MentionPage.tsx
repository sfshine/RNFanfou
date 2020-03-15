import React from 'react';
import {connect} from "react-redux";
import RefreshListView from "../../../global/components/refresh/RefreshListViewFlickr";
import UserCell from "../UserCell";
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import MentionAction from "~/biz/compose/mention/MentionAction";
import Logger from "~/global/util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState";
import ArchModal from "~/global/util/ArchModal";
import {Keyboard, Text, TouchableOpacity, View} from "react-native";
import {LayoutProvider} from "recyclerlistview";
import {screenWidth} from "~/global/util/ScreenUtil";
import BackPressComponent from "~/global/components/BackPressComponent";
import MentionSearchPage from "~/biz/compose/mention/search/MentionSearchPage";
import NavigationBarViewFactory from "~/global/navigator/NavigationBarViewFactory";
import TextInputEx from "~/global/components/TextInputEx";
import NavigationBar, {NAV_BAR_HEIGHT_ANDROID} from "~/global/navigator/NavigationBar";
import Row from '~/global/components/element/Row';

const action = new MentionAction()
const TAG = "MentionPage"

interface Props extends BaseProps {
    refreshFriends: Function,
    loadMoreFriends: Function,
    pageData: [],
    ptrState: string,
    callback: Function,
    modal: ArchModal,
}

interface State {
    checkedMap: object,
    inputKey: string,
    showSearchInput: boolean,
}

class MentionPage extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            checkedMap: {},
        }
        Keyboard.dismiss()
    }

    layoutProvider = new LayoutProvider(index => {
            // console.log("RefreshListViewlayoutProvider invoke", index)
            return 0
        },
        (type, dim) => {
            dim.width = screenWidth
            dim.height = 60;
        }
    );

    componentDidMount() {
        this.props.refreshFriends()
    }

    render() {
        let {pageData, ptrState} = this.props
        pageData = pageData ? pageData : []
        ptrState = ptrState ? ptrState : RefreshState.Refreshing
        return <View style={{flex: 1, backgroundColor: "white"}}>
            {this.renderNavBar()}
            <BackPressComponent backPress={this.dismiss}/>
            <RefreshListView
                customLayoutProvider={this.layoutProvider}
                data={pageData}
                ptrState={ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshFriends()
                }}
                extendedState={this.state.checkedMap}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.props.pageData)
                }}
            />
        </View>
    }

    renderNavBar = () => {
        const placeholder = "请输入";
        let {inputKey, showSearchInput} = this.state
        let inputView = showSearchInput ? <TextInputEx
            onRightButtonClick={() => this.setState({inputKey: null, showSearchInput: false})}
            autoFocus={true}
            onSubmitEditing={() => this.props.search(inputKey)}
            returnKeyType={"search"}
            numberOfLines={1}
            placeholder={placeholder}
            onChangeText={text => {
                this.setState({inputKey: text})
            }}
            value={this.state.inputKey}
        >
        </TextInputEx> : null

        let rightButtonConfigs = []
        if (!this.state.showSearchInput) {
            rightButtonConfigs.push({
                icon: this.state.showSearchInput ? "" : "search1",
                callback: () => this.setState({showSearchInput: !this.state.showSearchInput})
            })
        }
        rightButtonConfigs.push({
            text: Object.keys(this.state.checkedMap).length > 0 ? "完成" : "取消",
            callback: this.sure
        })
        return <NavigationBar
            titleView={inputView} title="选择好友"
            rightButton={NavigationBarViewFactory.createButtonGroups(rightButtonConfigs)}/>
    }

    navigateToSearch = () => {
        let archModal = new ArchModal()
        archModal.show(<MentionSearchPage modal={archModal}/>)
    }

    dismiss = () => {
        this.props.callback(null)
        this.props.modal.remove()
        return true
    }
    sure = () => {
        this.props.callback(this.state.checkedMap)
        this.props.modal.remove()
    }
    _renderItem = (data) => {
        Logger.log(TAG, "_renderItem ", this.state.checkedMap)
        let user = data.item;
        return (<UserCell showCheckBox={true}
                          checkMap={this.state.checkedMap} user={user} theme={this.props.theme}
                          onPress={() => {
                              // TipsUtil.toast("点击了" + user.name)
                              let stateMap = this.state.checkedMap
                              let tmpMap = {}
                              for (let key in stateMap) {
                                  tmpMap[key] = stateMap[key];
                              }
                              if (tmpMap[user.name]) {
                                  delete tmpMap[user.name]
                              } else {
                                  tmpMap[user.name] = true //表示选中, user.name是唯一的
                              }
                              this.setState({
                                  checkedMap: tmpMap
                              })
                          }}/>
        )
    };
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.MentionReducer.actionData,
        ptrState: state.MentionReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreFriends: (oldPageData) => dispatch(action.loadMoreFriends(oldPageData)),
        refreshFriends: () => dispatch(action.refreshFriends())

    })
)(MentionPage)
