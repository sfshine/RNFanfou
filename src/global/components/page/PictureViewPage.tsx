import React, {PureComponent} from 'react';
import Share from "react-native-share";
import RNFS from 'react-native-fs'
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import Fetch from "~/global/network/Fetch";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import PhotoView from 'react-native-photo-view-ex';
import {goBack} from "~/global/navigator/NavigationManager";

const TAG = "PictureViewPage"

export default class PictureViewPage extends PureComponent<BaseProps> {
    currentIndex = 0

    componentDidMount(): void {
        Logger.log(TAG, "componentDidMount", this.props)
    }

    render() {
        const {images} = this.props.navigation.state.params;
        return <PageCmpt backNav={this.props.navigation} style={{backgroundColor: "#000000"}}>
            <PhotoView
                source={{uri: images[0].url}}
                minimumZoomScale={0.5}
                maximumZoomScale={10}
                onTap={() => {
                    goBack(this.props)
                }}
                onLoad={() => console.log("Image loaded!")}
                style={{width: "100%", height: "100%"}}
            />
            <TouchableOpacity
                onPress={() => {
                    this.onShare(images).then()
                }}
                style={styles.shareButton}>
                <Text style={{color: "#FFFFFF"}}>分享</Text>
            </TouchableOpacity>
        </PageCmpt>
    }

    onShare = async (images) => {
        let loading = TipsUtil.toastLoading("请稍后...")
        try {
            let fileUrl = await Fetch.downloadFiles(images[this.currentIndex].url, `${RNFS.CachesDirectoryPath}/share_tmp.jpg`)
            Logger.log(TAG, "onShare start:", fileUrl)
            let res = await Share.open({url: fileUrl})
            Logger.log(TAG, "onShare end: ", res)
        } catch (e) {
            if (e.toString().indexOf("User did not share") > 0) {
                //no-op 用户取消了分享
            } else {
                TipsUtil.toastFail("分享失败，请重试" + e.toString())
            }
            Logger.error(TAG, 'err', e);
        }
        TipsUtil.toastHide(loading)
    }
}

const styles = StyleSheet.create({
    shareButton: {
        width: "100%",
        height: 45,
        zIndex: 100,
        position: 'absolute',
        bottom: 8,
        right: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});
