import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BaseProps from "~/global/base/BaseProps";
import {Api} from "~/biz/common/api/Api";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import TipsUtil from "~/global/util/TipsUtil";
import StatusComponent from "~/biz/timeline/components/StatusComponent";
import QuickComposeComponent from "~/biz/compose/QuickComposeComponent";
import ArchModal from "~/global/util/ArchModal";
import {COMPOSE_MODE} from "~/biz/compose/QuickComposeAction";

const favoriteMap = {}

interface Props extends BaseProps {
    item: any,
    highLight: boolean,
    callback: any,
}

interface State {
    favorited: boolean
}

class TimelineCell extends PureComponent<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            favorited: false
        }
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
        let highLightColor = this.props.highLight ? "#EEEEEE" : "#FFFFFF"
        return (
            <View style={[styles.container, {backgroundColor: highLightColor}]}>
                {<StatusComponent item={item} callback={this.props.callback}/>}
                <View style={styles.toolsContainer}>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        let archModel = new ArchModal()
                        archModel.show(<QuickComposeComponent modal={archModel}
                                                              data={{status: item, mode: COMPOSE_MODE.Forward}}/>)
                    }}>
                        <Icon name={'export-variant'} size={16} style={{color: styles.tools_text.color}}/>
                        <Text style={styles.tools_text}>转发</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        let archModel = new ArchModal()
                        archModel.show(<QuickComposeComponent modal={archModel}
                                                              data={{status: item, mode: COMPOSE_MODE.Comment}}/>)
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
        let url = favoriteMap[status.id] ? Api.favorites_destroy : Api.favorites_create
        FanfouFetch.post(url + status.id).then(json => {
                favoriteMap[status.id] = !this.state.favorited
                this.setState({
                    favorited: favoriteMap[status.id]
                })
                console.log("TimelineCell render favorite op : ", favoriteMap)
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
    (dispatch) => ({})
)(TimelineCell)
