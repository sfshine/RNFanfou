import React, {PureComponent} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";
import {removeHtmlTag} from "../../global/util/StringUtil";
import TipsUtil from "~/global/util/TipsUtil";
import BaseProps from "~/global/base/BaseProps";
import ArchModal from "~/global/util/ArchModal";
import Logger from "~/global/util/Logger";
import QuickComposeAction, {COMPOSE_MODE} from "~/biz/compose/QuickComposeAction";
import BackPressComponent from "~/global/components/BackPressComponent";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";

interface Props extends BaseProps {
    data: any,
    modal: ArchModal,
}

interface State {
    inputString: string,
    photos: Array<any>,
}

const TAG = "QuickComposeComponent"

class QuickComposeComponent extends PureComponent<Props, State> {
    placeHolder = ''

    constructor(props) {
        super(props);
        Logger.log(TAG, 'QuickComposeView constructor', this.props);
        this.state = {
            inputString: '',
            photos: [],
        };
    }

    render() {
        Logger.log(TAG, "render", this.props)
        const {data, theme} = this.props
        let photos = this.state.photos
        if (!data) {
            return <Text>data = null</Text>
        }
        let item = data.status
        let mode = data.mode
        // <a href="http://fanfou.com/dailu321" className="former">名字</a>
        let text = removeHtmlTag(item.text)
        this.placeHolder = (mode == COMPOSE_MODE.Forward ? "转@" : "评论@") + item.user.name + " " + text
        let textInput = <TextInput
            multiline={true}
            autoFocus={true}
            ref="textInput"
            placeholder={this.placeHolder}
            onChangeText={text => this.setState({inputString: text})}
            value={this.state.inputString}
            style={styles.textInput}/>

        let scrollView = <ScrollView contentContainerStyle={styles.scroll}>
            {photos && photos.map((photo, index) => {
                let source = {uri: photo.uri};
                if (photo.enableBase64) {
                    source = {uri: photo.base64};
                }
                return (
                    <TouchableOpacity
                        key={`image-${index}`}
                        style={styles.toolsButton} activeOpacity={0.7} onPress={this.confirmDeletePicture}>
                        <Image
                            style={styles.image}
                            source={source}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>
                )
            })}
        </ScrollView>

        let toolBar = <View style={[styles.toolsContainer, {backgroundColor: theme.brand_primary}]}>
            <TouchableOpacity style={styles.toolsButton}
                              activeOpacity={0.7}
                              onPress={() => QuickComposeAction.onChoosePicture(
                                  photos => this.setState({photos: photos}
                                  ))}>
                <AntDesign name={'picture'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                navigateN(NavigationManager.mainNavigation, "MentionPage", {
                    callback: this.onChooseMentions
                })
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
            <BackPressComponent backPress={this.dismiss}/>
            <TouchableOpacity
                style={styles.outSide}
                activeOpacity={1}
                onPress={this.dismiss}/>
            {textInput}
            <View style={{backgroundColor: "#FFFFFF"}}>
                {scrollView}
                {toolBar}
            </View>
        </View>
    }

    private confirmDeletePicture = () => {
        Alert.alert('提示', '确认删除这个图片？',
            [{
                text: '否',
                onPress: () => {
                }
            }, {
                text: '是',
                onPress: () => this.setState({photos: []})
            }])
    }

    onSendButtonClick = (data) => {
        const photos = this.state.photos
        let item = data.status
        let mode = data.mode
        let inputString = this.state.inputString
        if (mode == COMPOSE_MODE.Comment && inputString.length == 0 && photos.length == 0) {
            TipsUtil.toast("请输入内容")
            return
        }
        if (photos && photos.length > 0) {
            if (mode == COMPOSE_MODE.Comment) {
                QuickComposeAction.uploadImage(inputString + " " + this.placeHolder, photos, this.dismiss)
            } else {
                QuickComposeAction.uploadImage(inputString + " " + this.placeHolder, photos, this.dismiss)
            }
        } else {
            if (mode == COMPOSE_MODE.Comment) {
                QuickComposeAction.comment(inputString, item, this.placeHolder, this.dismiss)
            } else {
                QuickComposeAction.forward(inputString, item, this.placeHolder, this.dismiss)
            }
        }
    }


    dismiss = () => {
        Logger.log(TAG, "back")
        this.setState({
            inputString: '',
            photos: []
        })
        this.props.modal.remove()
        return true
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
const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
    photos: state.QuickComposeReducer.photos,
});
export default connect(mapStateToProps)(QuickComposeComponent);
