import React, {PureComponent} from 'react';
import {ImageViewer} from "react-native-image-zoom-viewer";
import Share from "react-native-share";
import RNFS from 'react-native-fs'
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";
import Fetch from "~/global/network/Fetch";
import {goBack} from "~/global/navigator/NavigationManager";
import {Text} from 'react-native'
import {Modal} from "@ant-design/react-native";

const TAG = "PictureViewPage"

export default class PictureViewPage extends PureComponent<BaseProps> {
    currentIndex = 0

    componentDidMount(): void {
        Logger.log(TAG, "componentDidMount", this.props)
    }

    render() {
        const {images} = this.props.navigation.state.params;
        return <PageCmpt backNav={this.props.navigation}>
            <ImageViewer
                enableSwipeDown={true}
                onSwipeDown={() => {
                    goBack(this.props)
                }}
                imageUrls={images}
                onChange={(index) => {
                    this.currentIndex = index
                }}
                saveToLocalByLongPress={false}
                onLongPress={() => {
                    Modal.operation([
                        {text: '分享', onPress: () => this.onShare(images)},
                        {text: '取消', onPress: () => Logger.log(TAG, '取消')},
                    ]);
                }}
            />
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
