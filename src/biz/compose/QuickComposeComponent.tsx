import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SYImagePicker from "react-native-syan-image-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";
import * as action from "./QuickComposeAction";
import {removeHtmlTag} from "../../global/util/StringUtil";
import BackPressComponent from "~/global/components/BackPressComponent";
import {Portal} from "@ant-design/react-native";
import FanfouFetch from "~/biz/common/api/FanfouFetch";
import {Api} from "~/biz/common/api/Api";
import TipsUtil from "~/global/util/TipsUtil";
import HomeAction from "~/biz/test/main/home/HomeAction";

export const COMPOSE_MODE = {
    Forward: 'Forward',
    Comment: 'Comment',
}

export default class QuickComposeComponent extends React.Component {
    placeHolder = ''

    constructor(props) {
        super(props);
        console.log('QuickComposeView constructor', this.props);
        this.state = {
            photos: [],
            inputString: ''
        };
    }

    render() {
        console.log("QuickComposeView render", this.props)
        const {data, theme} = this.props
        if (!data) {
            return <Text>data = null</Text>
        }
        const {photos} = this.state
        let item = data.status
        let mode = data.mode
        // <a href="http://fanfou.com/dailu321" className="former">名字</a>
        let text = removeHtmlTag(item.text)
        this.placeHolder = (mode == COMPOSE_MODE.Forward ? "转:@" : "评论: @") + item.user.name + " " + text
        let textInput = <TextInput
            multiline={true}
            autoFocus={true}
            ref="textInput"
            placeholder={this.placeHolder}
            onChangeText={text => this.setState({inputString: text})}
            value={this.state.inputString}
            style={styles.textInput}/>

        let scrollView = <ScrollView contentContainerStyle={styles.scroll}>
            {photos.map((photo, index) => {
                let source = {uri: photo.uri};
                if (photo.enableBase64) {
                    source = {uri: photo.base64};
                }
                return (
                    <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                        Alert.alert('提示', '确认删除这个图片？', [{
                            text: '否', onPress: () => {
                            }
                        }, {
                            text: '是', onPress: () => {
                                this.setState({photos: []})
                            }
                        }])
                    }}>
                        <Image
                            key={`image-${index}`}
                            style={styles.image}
                            source={source}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>
                )
            })}
        </ScrollView>

        let toolBar = <View style={[styles.toolsContainer]}>
            <BackPressComponent backPress={this.backPress}/>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={this.handleAsyncSelectPhoto}>
                <AntDesign name={'picture'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                // NavigationUtil.fromMainToPage("MentionScreen", {
                //     // selectNames: this.state.inputString,
                //     callback: this.onChooseMentions
                // })
            }}>
                <Feather name={'at-sign'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                this.onSendButtonClick(data)
            }}>
                <Icon name={'send'} size={25} style={{color: 'white', marginRight: 10}}/>
            </TouchableOpacity>
        </View>

        return <View style={styles.container}>
            <TouchableOpacity style={styles.outSide} activeOpacity={1} onPress={
                () => {
                    this.backPress()
                }
            }/>
            {textInput}
            <View style={{backgroundColor: "#FFFFFF"}}>
                {scrollView}
                {toolBar}
            </View>
        </View>
    }

    onSendButtonClick = (data) => {
        const {photos} = this.state
        let item = data.status
        let mode = data.mode
        let input = this.state.inputString
        if (mode == COMPOSE_MODE.Comment && input.length == 0 && photos.length == 0) {
            TipsUtil.toast("请输入内容")
            return
        }
        TipsUtil.toastLoading('发送中...');
        if (photos.length > 0) {
            //api不支持 图片转发回复,通过拼接 用户名和消息walk around
            FanfouFetch.post(Api.photos_upload,
                {
                    status: input + " " + this.placeHolder
                }, {
                    "photo": photos[0].uri
                })
                .then(json => {
                    console.log("发送成功", json)
                    TipsUtil.toastSuccess("发送成功")
                    setTimeout(() => {
                        this.backPress()
                    }, 1500)
                })
                .catch(error => {
                    TipsUtil.toastFail("发送失败：" + error)
                });
        } else {
            let msgBody = mode == COMPOSE_MODE.Forward ?
                {
                    status: input + " " + this.placeHolder,
                    repost_status_id: item.id,
                } : {
                    status: "@" + item.user.name + " " + input,
                    in_reply_to_status_id: item.id,
                }
            FanfouFetch.post(Api.statuses_update, msgBody)
                .then(json => {
                    console.log(json)
                    TipsUtil.toastSuccess("发送成功")
                    setTimeout(() => {
                        this.backPress()
                    }, 1500)
                })
                .catch(error => {
                    TipsUtil.toastFail("发送失败：" + error)
                })
        }
    }

    handleAsyncSelectPhoto = async () => {
        return SYImagePicker.asyncShowImagePicker({
            imageCount: 1,
            isCrop: false,
            compress: false,
        }).then(photos => {
            if (!photos || photos.length == 0) {
                console.log("没有选择照片！")
            } else {
                console.log("选择的图片", photos)
                this.setState({
                    photos: photos
                })
            }
        }).catch(error => {
            console.log("选择图片失败：", error)
            // Toast.show(error.message, 2)
        })
    };

    clearInput() {
        this.setState({
            photos: [],
            // textInputPlaceHolder: "再发一条！"
            inputString: ''
        })
    }

    backPress = () => {
        console.log("Quick:backPress")
        this.clearInput()
    }

    onChooseMentions = (checkedMap) => {
        if (!checkedMap) return
        let names = ''
        Object.keys(checkedMap).forEach(function (name) {
            if (checkedMap[name]) {
                names += "@" + name + " "
            }
        });
        let curInputStr = this.state.inputString;
        this.setState({
            inputString: curInputStr + names
        })
    }


}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        position: 'absolute',
        zIndex: 101,
        bottom: 0,
    },
    outSide: {
        height: '60%',
    },
    textInput: {
        backgroundColor: "#FFFFFF",
        margin: 1,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 15,
        flex: 1,
        alignSelf: "stretch",
        padding: 10,
        textAlign: 'left',
        textAlignVertical: 'top'
    },
    scroll: {
        flexWrap: 'wrap',
        flexDirection: 'row-reverse'
    },
    toolsContainer: {
        height: 48,
        alignItems: "center",
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    toolsButton: {
        alignItems: "center",
    },
    image: {
        width: 50,
        height: 50,
        backgroundColor: '#F0F0F0',
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingViewText: {
        marginTop: 10,
        fontSize: 15,
    }
})
