import React from 'react';
import {connect} from "react-redux";
import RefreshListView from "../../../global/components/refresh/RefreshListViewFlickr";
import UserCell from "../UserCell";
import BaseProps from "~/global/base/BaseProps";
import MentionAction from "~/biz/compose/mention/MentionAction";
import RefreshState from "~/global/components/refresh/RefreshState";
import ArchModal from "~/global/util/ArchModal";
import {Keyboard, View} from "react-native";
import {LayoutProvider} from "recyclerlistview";
import {screenWidth} from "~/global/util/ScreenUtil";
import BackPressComponent from "~/global/components/BackPressComponent";
import MentionSearchPage from "~/biz/compose/mention/search/MentionSearchPage";
import NavigationBarViewFactory from "~/global/navigator/NavigationBarViewFactory";
import TextInputEx from "~/global/components/TextInputEx";
import NavigationBar from "~/global/navigator/NavigationBar";
import ReduxResetComponent from "~/global/components/ReduxResetComponent";
import {MENTION_ACTIONS} from "~/biz/compose/mention/MentionReducer";

const action = new MentionAction()
const TAG = "MentionPage"

interface Props extends BaseProps {
    refreshFriends: Function,
    loadMoreFriends: Function,
    pageData: [],
    ptrState: string,
    callback: Function,
    filter: Function,
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
            inputKey: "",
            showSearchInput: false,
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
        this.props.refreshFriends(null)
    }

    render() {
        let {pageData, ptrState} = this.props
        pageData = pageData ? pageData : []
        ptrState = ptrState ? ptrState : RefreshState.Refreshing
        return <View style={{flex: 1, backgroundColor: "white"}}>
            <ReduxResetComponent resetAction={MENTION_ACTIONS.ResetRedux}/>
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
                    this.props.refreshFriends(this.state.inputKey)
                }}
                extendedState={this.state.checkedMap}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.state.inputKey, this.props.pageData)
                }}
            />
        </View>
    }

    renderNavBar = () => {
        const placeholder = "请输入";
        let {showSearchInput} = this.state
        let inputView = showSearchInput ? <TextInputEx
            onRightButtonClick={this.cancelFilter}
            autoFocus={true}
            returnKeyType={"search"}
            numberOfLines={1}
            placeholder={placeholder}
            onChangeText={text => {
                this.setState({inputKey: text})
                this.props.filter(text)
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
    cancelFilter = () => {
        this.setState({inputKey: null, showSearchInput: false})
        this.props.filter(null)
    }
    dismiss = () => {
        if (this.state.showSearchInput) {
            this.cancelFilter()
        } else {
            this.props.callback(null)
            this.props.modal.remove()
        }
        return true
    }
    sure = () => {
        this.props.callback(this.state.checkedMap)
        this.props.modal.remove()
    }
    _renderItem = (data) => {
        let user = data.item;
        return (<UserCell showCheckBox={true}
                          checkMap={this.state.checkedMap} user={user} theme={this.props.theme}
                          onPress={(resultMap) => this.setState({
                              checkedMap: resultMap
                          })}/>
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
        refreshFriends: (query) => dispatch(action.refreshFriends(query)),
        loadMoreFriends: (query) => dispatch(action.loadMoreFriends(query)),
        filter: (query) => dispatch(action.filter(query)),
    })
)(MentionPage)
