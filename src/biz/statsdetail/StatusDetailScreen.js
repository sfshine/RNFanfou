import React from 'react';
import {StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../../global/navigator/Navigationbar";
import CommonViewFactory from "../../global/util/CommonViewFactory";
import NavigationUtil from "../../../global/navigator/NavigationUtil";
import AntDesign from "react-native-vector-icons/AntDesign";
import StatusComponent from "../home/components/StatusComponent";
import TimelineCell from "../home/TimelineCell";
import RefreshListView from "../../global/components/refresh/RefreshListView";
import * as action from "./StatusDetailAction";
import QuickComposeComponent, {COMPOSE_MODE} from "../home/compose/QuickComposeComponent";
import * as quickComposeAction from "../home/compose/QuickComposeAction";
import FanfouFetch from "../../../global/network/FanfouFetch";
import {statuses_destroy} from "../../../global/network/Api";
import {Toast} from 'antd-mobile-rn';
import Global from '../../../global/Global';
import BackPressHelper from "../../../global/components/BackPressHelper";
import EventBus from "react-native-event-bus";
import {removeHtmlTag} from "../../global/util/StringUtil";
import SafeAreaViewPlus from "../../global/components/SafeAreaViewPlus";

class StatusDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.item = this.props.navigation.state.params.item
        this.state = {
            headerItem: this.item,
            pageData: null,
            loadState: null,
            isFocus: true,
        }
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
        return true
    }

    componentDidMount() {
        console.log('StatusDetailScreen componentDidMount', this.props);
        this.props.navigation.addListener('willFocus', this.willFocus)
        this.props.navigation.addListener('willBlur', this.willBlur)
    }

    willFocus = () => {
        console.log("StatusDetailScreen willFocus")
        this.setState({
            isFocus: true
        })
    }
    willBlur = () => {
        console.log("StatusDetailScreen willBlur ")
        this.setState({
            isFocus: false
        })
    }

    componentWillMount() {
        this.props.refreshContextTimeline(this.state.headerItem.id)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.item.id == nextProps.msg_id && JSON.stringify(nextProps.pageData) != JSON.stringify(this.state.pageData)) {
            this.setState({
                headerItem: nextProps.headerItem,
                pageData: nextProps.pageData,
                loadState: nextProps.loadState
            })
            return false
        }
        return true
    }

    render() {
        const {item} = this.props.navigation.state.params;
        const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar//app标题栏
            title={'消息'}
            statusBar={statusBar}//状态栏配置
            style={theme.styles.navBar}//颜色遵循主题的
            leftButton={CommonViewFactory.getLeftBackButton(() => NavigationUtil.goBack(this.props))}
        />;
        return <SafeAreaViewPlus backPress={this.goBack}>
            <QuickComposeComponent isFocus={this.state.isFocus}/>
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    {navigationBar}
                    <RefreshListView
                        ListHeaderComponent={this._renderHeader}
                        theme={this.props.theme}
                        data={this.state.pageData ? this.state.pageData : []}
                        ptrState={this.state.loadState}
                        renderItem={this._renderItem}
                        keyExtractor={(item) => item.id}
                        onHeaderRefresh={() => {
                            this.props.refreshContextTimeline(item.id)
                        }}
                    />
                </View>
                {this.renderToolbar(item)}
            </View>
        </SafeAreaViewPlus>
    }


    _renderHeader = () => {
        return <View style={{backgroundColor: '#FFFFFF', paddingBottom: 5, marginBottom: 2}}>
            <StatusComponent
                theme={this.props.theme} item={this.state.headerItem}
                callback={() => this._onStatusClick(this.state.headerItem)}/>
        </View>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell highLight={this.state.headerItem.id != this.item.id && this.item.id == item.id}
                          item={item}
                          callback={() => this._onStatusClick(item)}/>
        )
    };
    _onStatusClick = (status) => {
        this.props.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Comment})
    }

    renderToolbar(status) {
        const {theme} = this.props;
        return <View style={[styles.toolsContainer, {backgroundColor: theme.themeColor}]}>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                this.props.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Comment})
            }
            }>
                <AntDesign name={'message1'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                this.props.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Forward})
            }}>
                <AntDesign name={'retweet'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            {status.user.id === Global.user.id ?
                <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                    Alert.alert('提示', `确定删除:${removeHtmlTag(status.text)}?`,
                        [
                            {
                                text: '取消', onPress: () => {

                                }
                            },
                            {
                                text: '确定', onPress: () => {
                                    Toast.loading('删除中...', 3, null, true);
                                    FanfouFetch.post(statuses_destroy(), {id: status.id}).then(json => {
                                        if (json) {
                                            Toast.success("删除成功", 1, false)
                                            setTimeout(() => {
                                                NavigationUtil.goBack(this.props)
                                            }, 1000)
                                        } else {
                                            Toast.fail("删除失败", 2, false)
                                        }
                                    }).catch(e => {
                                        Toast.fail("删除失败" + e.toString(), 2, false)
                                    })
                                }
                            }
                        ])
                }}>
                    <AntDesign name={'delete'} size={25} style={{color: 'white'}}/>
                </TouchableOpacity> : null}
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        justifyContent: 'space-between',
    },
    top: {
        margin: 10,
        justifyContent: 'center',
    },
    toolsContainer: {
        height: 50,
        alignItems: "center",
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    toolsButton: {
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#F0F0F0',
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        headerItem: state.statusDetailReducer.headerItem,
        pageData: state.statusDetailReducer.pageData,
        loadState: state.statusDetailReducer.loadState,
        msg_id: state.statusDetailReducer.msg_id,
    }),
    (dispatch) => ({
        refreshContextTimeline: (msgId) => dispatch(action.refreshContextTimeline(msgId)),
        onShowQuickCompose: (item) => dispatch(quickComposeAction.onShowQuickCompose(item))
    })
)(StatusDetailScreen)
