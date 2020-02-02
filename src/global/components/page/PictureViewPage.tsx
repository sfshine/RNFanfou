import React, {PureComponent} from 'react';
import {ImageViewer} from "react-native-image-zoom-viewer";
import Share from "react-native-share";
import {requestPermission} from "~/global/util/SystemUtil";
import RNFS from 'react-native-fs'
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import Logger from "~/global/util/Logger";
import TipsUtil from "~/global/util/TipsUtil";

const TAG = "PictureViewPage"

export default class PictureViewPage extends PureComponent<BaseProps> {
    currentIndex = 0

    componentDidMount(): void {
        Logger.log(TAG, "componentDidMount", this.props)
    }

    render() {
        const {images} = this.props.navigation.state.params;
        return <PageCmpt title={'查看图片'} backNav={this.props.navigation}
                         rightNavButtonConfig={{
                             text: "分享",
                             callback: () => {
                                 this.onShare(images).then()
                             }
                         }}>
            <ImageViewer
                saveToLocalByLongPress={false}
                imageUrls={images}
                onChange={(index) => {
                    this.currentIndex = index
                }}
            />
        </PageCmpt>
    }

    onShare = async (images) => {
        let loading = TipsUtil.toastLoading("请稍后...")
        let fileUrl = await this.downloadFiles(images[this.currentIndex].url, `${RNFS.CachesDirectoryPath}/share_tmp.jpg`)
        TipsUtil.toastHide(loading)
        Logger.log(TAG, "onShare start:", fileUrl)
        let res = await Share.open({url: fileUrl})
        Logger.log(TAG, "onShare end: ", res)
    }

    async downloadFiles(fromUrl, downloadDest) {
        Logger.log(TAG, "downloadFiles start1:", fromUrl)
        await requestPermission()
        Logger.log(TAG, "downloadFiles start2:", fromUrl)
        // 图片
        const options = {
            fromUrl: fromUrl,
            toFile: downloadDest,
            background: true,
        };
        return new Promise((resolve, reject) => {
            RNFS.downloadFile(options).promise.then(res => {
                Logger.log(TAG, 'downloadFile success: file://' + downloadDest)
                resolve('file://' + downloadDest)
            }).catch(err => {
                Logger.error(TAG, 'err', err);
                reject(err)
            })
        });
    }
}
