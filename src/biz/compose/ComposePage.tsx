import React from 'react';
import {Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BaseProps from "~/global/base/BaseProps";
import Logger from "~/global/util/Logger";
import QuickComposeAction from "~/biz/compose/QuickComposeAction";
import TipsUtil from "~/global/util/TipsUtil";
import {goBack} from "~/global/navigator/NavigationManager";
import PageCmpt from "~/global/components/PageCmpt";
import ArchModal from "~/global/util/ArchModal";
import MentionPage from "~/biz/compose/mention/MentionPage";

interface Props extends BaseProps {
    data: any,
}

interface State {
    inputString: string,
    photos: Array<any>,
}

const TAG = "ComposePage"

class ComposePage extends React.PureComponent<Props, State> {
    private selection
    private placeHolder = "你在做什么"

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            inputString: ''
        };
    }

    render() {
        const {photos} = this.state;
        let textInput = <TextInput
            ref="textInput"
            onSelectionChange={(event) => this.selection = event.nativeEvent.selection}
            autoFocus={true}
            multiline={true}
            placeholder={this.placeHolder}
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
        return <PageCmpt title={'写消息'} backNav={this.props.navigation}>
            {textInput}
            <View>
                {scrollView}
                {this.renderToolbar()}
            </View>
        </PageCmpt>
    }

    renderToolbar() {
        const {theme} = this.props;
        return <View style={[styles.toolsContainer, {backgroundColor: theme.brand_primary}]}>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7}
                              onPress={() => QuickComposeAction.onChoosePicture(
                                  photos => this.setState({photos: photos}
                                  ))}>
                <AntDesign name={'picture'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                let archModal = new ArchModal()
                archModal.show(<MentionPage callback={this.onChooseMentions} modal={archModal}/>)
            }}>
                <Feather name={'at-sign'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={this.onHashButtonClick}>
                <Feather name={'hash'} size={25} style={{color: 'white'}}/>
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
    onHashButtonClick = () => {
        let curInputStr = this.state.inputString + "##"
        this.setState({
            inputString: curInputStr
        })
        setTimeout(() => {
            // @ts-ignore
            this.refs["textInput"].setNativeProps({
                selection: {start: curInputStr.length - 1, end: curInputStr.length - 1}
            })
        }, 10)
    }
    onSendButtonClick = () => {
        const {photos, inputString} = this.state
        if (inputString.length == 0 && photos.length == 0) {
            TipsUtil.toastFail("请输入内容")
            return
        }
        if (photos && photos.length > 0) {
            QuickComposeAction.uploadImage(inputString, photos, this.dismiss)
        } else {
            QuickComposeAction.createMessage(inputString, this.dismiss)
        }
    }
    dismiss = () => {
        Logger.log(TAG, "back")
        this.setState({
            inputString: '',
            photos: []
        })
        goBack(this.props)
    }
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
)(ComposePage)
