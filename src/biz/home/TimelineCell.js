import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";
import StatusComponent from "./components/StatusComponent";
import {COMPOSE_MODE} from "./compose/QuickComposeComponent";
import * as action from "./compose/QuickComposeAction";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FanfouFetch from "../../global/network/FanfouFetch";
import {favorites_create, favorites_destroy} from "../../global/network/Api";
import {Toast} from "antd-mobile-rn";

const favoriteMap = {}

class TimelineCell extends PureComponent {
    constructor(props) {
        super(props)
        let item = this.props.item
        this.state = {
            favorited: false
        }
        // console.log("TimelineCell constructor: ", item)
    }


    render() {
        let {item, theme} = this.props;
        // console.log("TimelineCell render item: ", item)
        // console.log("TimelineCell render favoriteMap: ", favoriteMap)
        if (!(item.id in favoriteMap)) {
            favoriteMap[item.id] = item.favorited
        }
        // console.log("TimelineCell render favoriteMap 2: ", favoriteMap)
        this.state = {
            favorited: favoriteMap[item.id]
        }
        let highLightColor = this.props.highLight ? theme.highLightColor : "#FFFFFF"
        return (
            <View style={[styles.container, {backgroundColor: highLightColor}]}>
                {<StatusComponent item={item} theme={theme} callback={this.props.callback}/>}
                <View style={styles.toolsContainer}>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        this._showPop(item, COMPOSE_MODE.Forward)
                    }}>
                        <Icon name={'export-variant'} size={16} style={{color: styles.tools_text.color}}/>
                        <Text style={styles.tools_text}>转发</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        this._showPop(item, COMPOSE_MODE.Comment)
                    }}>
                        <Icon name={'file-document-edit-outline'} size={16}
                              style={{color: styles.tools_text.color}}/>
                        <Text style={styles.tools_text}>评论</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7}
                                      onPress={() => this.favorite(item)}>
                        <MaterialIcons name={this.state.favorited ? 'favorite' : 'favorite-border'} size={16}
                                       style={{color: styles.tools_text.color}}/>
                        <Text style={styles.tools_text}>收藏</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    favorite(status) {
        let url = favoriteMap[status.id] ? favorites_destroy() : favorites_create()
        FanfouFetch.post(url + status.id).then(json => {
                favoriteMap[status.id] = !this.state.favorited
                // if (favoriteMap[status.id]) {
                //     Toast.show("收藏成功...", 1, false)
                // } else {
                //     Toast.show("取消收藏成功.", 1, false)
                // }
                this.setState({
                    favorited: favoriteMap[status.id]
                })
                console.log("TimelineCell render favorite op : ", favoriteMap)
            }
        ).catch(err => {
            Toast.show("操作失败", 2, false)
        })
    }

    _showPop(status, mode) {
        this.props.onShowQuickCompose({status: status, mode: mode})
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginLeft: 4,
        marginRight: 4,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingBottom: 5,
        flex: 1,
    },
    toolsContainer: {
        marginTop: 10,
        justifyContent: 'space-around',
        borderTopWidth: 0.3,
        borderTopColor: '#AAAAAA',
        flexDirection: 'row',
    },
    toolsButton: {
        paddingLeft: 20,
        paddingRight: 20,
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

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({
        onShowQuickCompose: (item) => dispatch(action.onShowQuickCompose(item))
    })
)(TimelineCell)