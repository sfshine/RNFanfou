import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../../global/navigator/Navigationbar";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FanfouFetch from "../../../global/network/FanfouFetch";
import NavigationUtil from "../../../global/navigator/NavigationUtil";
import SYImagePicker from "react-native-syan-image-picker";
import {photos_upload, statuses_update} from '../../../global/network/Api';
import SafeAreaViewPlus from "../../../global/components/SafeAreaViewPlus";
import {showLoading, toast, toastFail, toastSuccess} from "../../../global/util/UIUtil";

class ComposeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            textInputPlaceHolder: "你在做什么",
            inputString: ''
        };
    }

    componentWillMount() {
        console.log('ComposeScreen componentWillMount', this.props);
    }

    render() {
        const {theme} = this.props;
        const {photos} = this.state;
        let navigationBar = <NavigationBar//app标题栏
            title={'写消息'}
            style={theme.styles.navBar}
            // rightButton={this.renderRightButton()}
            backPress={this.onBack}
        />;

        let textInput = <TextInput
            onSelectionChange={(event) => this.selection = event.nativeEvent.selection}
            autoFocus={true}
            ref="textInput"
            placeholder={this.state.textInputPlaceHolder}
            value={this.state.inputString}
            onChangeText={text => this.setState({inputString: text})}
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
        return <SafeAreaViewPlus backPress={this.onBack}>
            {navigationBar}
            {textInput}
            <View>
                {scrollView}
                {this.renderToolbar()}
            </View>
        </SafeAreaViewPlus>
    }

    renderToolbar() {
        const {theme} = this.props;
        return <View style={[styles.toolsContainer, {backgroundColor: theme.themeColor}]}>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={this.handleAsyncSelectPhoto}>
                <AntDesign name={'picture'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                NavigationUtil.fromMainToPage("MentionScreen", {
                    // selectNames: this.state.inputString,
                    callback: this.onChooseMentions
                })
            }}>
                <Feather name={'at-sign'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={this.onSendButtonClick}>
                <Icon name={'send'} size={25} style={{color: 'white', marginRight: 10}}/>
            </TouchableOpacity>
        </View>
    }

    onChooseMentions = (checkedMap) => {
        if (!checkedMap) return
        let names = ''
        Object.keys(checkedMap).forEach(function (name) {
            if (checkedMap[name]) {
                names += "@" + name + " "
            }
        });
        let curInputStr = this.state.inputString
        this.setState({
            inputString: curInputStr + names
        })
    }

    // renderRightButton() {
    //     return (<View style={{flexDirection: 'row'}}>
    //             <TouchableOpacity
    //                 onPress={this.onSendButtonClick}>
    //                 <Icon
    //                     name={'send'}
    //                     size={26}
    //                     style={{color: 'white', marginRight: 10}}
    //                 />
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }

    onSendButtonClick = () => {
        const {photos, inputString} = this.state
        if (inputString.length == 0 && photos.length == 0) {
            toast("请输入内容")
            return
        }
        showLoading('发送中...');
        if (photos.length > 0) {
            FanfouFetch.post(photos_upload(),
                {
                    status: inputString
                }, {
                    "photo": photos[0].uri
                })
                .then(json => {
                    console.log(json)
                    toastSuccess("发送成功")
                    this.clearInput();
                })
                .catch(error => {
                    toastFail("发送失败")
                });
        } else {
            FanfouFetch.post(statuses_update(),
                {
                    status: inputString
                })
                .then(json => {
                    console.log(json)
                    toastSuccess("发送成功")
                    this.clearInput();
                })
                .catch(error => {
                    toastFail("发送失败：" + error)
                })
        }
    }

    clearInput() {
        this.setState({
            photos: [],
            // textInputPlaceHolder: "再发一条！"
            inputString: ''
        })
        NavigationUtil.goBack(this.props)
    }

    onBack = () => {
        return NavigationUtil.goBack(this.props);
    }

    handleAsyncSelectPhoto = async () => {
        return SYImagePicker.asyncShowImagePicker({
            imageCount: 1,
            isCrop: false,
            compress: false,
        }).then(photos => {
            if (!photos || photos.length == 0) {
                reject("没有选择照片！")
            }
            else {
                console.log("选择的图片", photos)
                this.setState({
                    photos: photos
                })
            }
        }).catch(error => {
            console.log("选择图片失败：", error)
            Toast.show(error.message, 4)
        })
    };
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        flex: 1,
    },
    textInput: {
        fontSize: 15,
        flex: 1,
        alignSelf: "stretch",
        padding: 10,
        textAlign: 'left',
        textAlignVertical: 'top'
    },
    scroll: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row-reverse'
    },
    toolsContainer: {
        marginTop: 10,
        height: 48,
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
})
export default connect(
    (state) => ({
        theme: state.themeReducer.theme
    }),
    (dispatch) => ({})
)(ComposeScreen)