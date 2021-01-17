import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View, Clipboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import BaseProps from "~/global/base/BaseProps";
import {Api} from "~/biz/common/api/Api";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import TipsUtil from "~/global/util/TipsUtil";
import StatusComponent from "~/biz/timeline/components/StatusComponent";
import QuickComposeComponent from "~/biz/compose/QuickComposeComponent";
import ArchModal from "~/global/util/ArchModal";
import {COMPOSE_MODE} from "~/biz/compose/QuickComposeAction";
import {Modal} from "@ant-design/react-native";
import {removeHtmlTag} from "~/global/util/StringUtil";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GlobalCache} from "~/global/AppGlobal";
import {confirmDeleteStatus} from "~/biz/statsdetail/StatusDetailPage";

const favoriteMap = {}

interface Props extends BaseProps {
    item: any,
    highLight?: boolean,
    onItemClick?: any,
    onRefresh?: Function,
}

export default class TimelineCell extends PureComponent<Props> {
    constructor(props) {
        super(props)
    }


    render() {
        let {item} = this.props;
        if (item.id ! in favoriteMap) {
            favoriteMap[item.id] = item.favorited
        }
        let highLightColor = this.props.highLight ? "#EEEEEE" : "#FFFFFF"
        return (
            <View style={[styles.container, {backgroundColor: highLightColor}]}>
                {<StatusComponent item={item} onItemClick={this.props.onItemClick}
                                  onLongPress={() => this.showLongPressOptions(item)}/>}
                <View style={styles.toolsContainer}>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        this.quickSend(item, COMPOSE_MODE.Forward)
                    }}>
                        <AntDesign name={'retweet'} size={23} style={{color: styles.tools_text.color}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        this.quickSend(item, COMPOSE_MODE.Comment)
                    }}>
                        <Icon name={'chat-processing'} size={23} style={{color: styles.tools_text.color}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7}
                                      onPress={() => this.showMoreOptions(item)}>
                        <Icon name={'dots-horizontal'} size={23} style={{color: styles.tools_text.color}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    quickSend = (status, mode) => {
        let archModel = new ArchModal()
        archModel.show(<QuickComposeComponent modal={archModel} data={{status: status, mode: mode}}/>)
    }

    showLongPressOptions = (status) => {
        let actions = [{
            text: "转发",
            onPress: () => this.quickSend(status, COMPOSE_MODE.Forward)

        }, {
            text: "评论",
            onPress: () => this.quickSend(status, COMPOSE_MODE.Comment)
        }, {
            text: favoriteMap[status.id] ? "取消收藏" : "收藏",
            onPress: () => this.favorite(status)
        }, {
            text: "复制",
            onPress: () => this.copy(status)
        }]
        if (status.user && status.user.id === GlobalCache.user.id) {
            actions.push({
                text: "删除",
                onPress: () => confirmDeleteStatus(status, () => {
                    this.props.onRefresh && this.props.onRefresh()
                })
            })
        }
        Modal.operation(actions)
    }

    showMoreOptions = (status) => {
        let actions = [{
            text: favoriteMap[status.id] ? "取消收藏" : "收藏",
            onPress: () => this.favorite(status)
        }, {
            text: "复制",
            onPress: () => this.copy(status)
        }]
        if (status.user && status.user.id === GlobalCache.user.id) {
            actions.push({
                text: "删除",
                onPress: () => confirmDeleteStatus(status, () => {
                    this.props.onRefresh && this.props.onRefresh()
                })
            })
        }
        Modal.operation(actions)
    }

    copy = (status) => {
        Clipboard.setString(removeHtmlTag(status.text))
        TipsUtil.toastSuccess("复制成功")
    }

    favorite = (status) => {
        let url = favoriteMap[status.id] ? Api.favorites_destroy : Api.favorites_create
        FanfouFetch.post(url + status.id).then(json => {
                if (favoriteMap[status.id]) {
                    TipsUtil.toastSuccess("取消收藏成功!")

                } else {
                    TipsUtil.toastSuccess("收藏成功!")
                }
                favoriteMap[status.id] = !favoriteMap[status.id]
            }
        ).catch(err => {
            TipsUtil.toastFail("操作失败")
        })
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 5,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    toolsContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'flex-end',
        borderBottomWidth: 0.3,
        borderBottomColor: '#AAAAAA',
        flexDirection: 'row',
    },
    toolsButton: {
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: "center",
        flexDirection: 'row',
    },
    tools_text: {
        marginLeft: 5,
        fontSize: 16,
        color: '#AAAAAA',
        textAlign: 'left',
    }
});

