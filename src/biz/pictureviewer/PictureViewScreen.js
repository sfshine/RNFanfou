import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../global/navigator/Navigationbar";
import {ImageViewer} from "react-native-image-zoom-viewer";
import CommonViewFactory from "../../global/util/CommonViewFactory";
import NavigationUtil from "../../global/navigator/NavigationUtil";
import Share from "react-native-share";
import {requestPermission} from "../../global/util/SystemUtil";
import RNFS from 'react-native-fs'
import BackPressHelper from "../../global/components/BackPressHelper";
import SafeAreaViewPlus from "../../global/components/SafeAreaViewPlus";
import {toast, toastHide} from "../../global/util/UIUtil";

class PictureViewScreen extends React.Component {
    currentIndex = 0

    constructor(props) {
        super(props)
        console.log('PictureViewScreen constructor', this);
    }

    componentWillUnmount() {
        console.log("PictureViewScreen componentWillUnmount")
    }

    componentDidMount() {
        console.log('PictureViewScreen componentDidMount', this.props);
    }

    render() {
        const {images} = this.props.navigation.state.params;
        const {theme} = this.props;
        let navigationBar =
            <NavigationBar//app标题栏
                backPress={() => {
                    NavigationUtil.goBack(this.props)
                }}
                title={'查看图片'}
                style={theme.styles.navBar}//颜色遵循主题的
                rightButton={this.renderRightButton(images)}
            />;
        return <SafeAreaViewPlus backPress={() => {
            return NavigationUtil.goBack(this.props)
        }}>
            {navigationBar}
            <ImageViewer
                saveToLocalByLongPress={false}
                imageUrls={images}
                onChange={(index) => {
                    this.currentIndex = index
                }}
                onClick={(onCancel) => {
                    NavigationUtil.goBack(this.props)
                }}
            />
        </SafeAreaViewPlus>
    }

    renderRightButton(images) {
        return <View style={{flexDirection: 'row',}}>
            {/*<TouchableOpacity style={{marginRight: 10}} activeOpacity={0.7} onPress={() =>*/}
            {/*this.downloadFiles(images[this.currentIndex].url, `${RNFS.ExternalDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`)*/}
            {/*}>*/}
            {/*<Ionicons*/}
            {/*name={'ios-shuffle'}*/}
            {/*size={20}*/}
            {/*style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>*/}
            {/*</TouchableOpacity>*/}
            {CommonViewFactory.getShareButton(
                async () => {
                    toast("请稍后...")
                    let fileUrl = await this.downloadFiles(images[this.currentIndex].url, `${RNFS.CachesDirectoryPath}/share_tmp.jpg`)
                    console.log("Share: " + fileUrl)
                    toastHide()
                    let res = await Share.open({url: fileUrl})
                    console.log(res)
                }
            )}
        </View>
    }

    async downloadFiles(fromUrl, downloadDest) {
        await requestPermission()
        // 图片
        const options = {
            fromUrl: fromUrl,
            toFile: downloadDest,
            background: true,
            // begin: (res) => {
            //     console.log('begin', res);
            //     console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            // },
            // progress: (res) => {
            //     let progress = res.bytesWritten / res.contentLength;
            //     console.log('progress:', progress);
            // }
        };
        return new Promise((resolve, reject) => {
            RNFS.downloadFile(options).promise.then(res => {
                console.log('success', res);
                console.log('file://' + downloadDest)
                resolve('file://' + downloadDest)
            }).catch(err => {
                console.log('err', err);
                reject(err)
            })
        });
    }
}

const styles = StyleSheet.create({});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme
    }),
    (dispatch) => ({})
)(PictureViewScreen)