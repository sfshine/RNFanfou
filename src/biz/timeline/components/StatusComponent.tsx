import React, {PureComponent} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AutoHeightImage from "~/global/components/AutoHeightImage";
import HTMLView from 'react-native-htmlview';
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import {formatDate} from "~/global/util/DateUtil";
import Logger from "~/global/util/Logger";
import {FanfouUtil} from "~/biz/common/util/FanfouUtil";
import {connect} from "react-redux";

const screenWidth = Dimensions.get('window').width;

interface Props extends BaseProps {
    item: any,
    callback: any,
}

const TAG = "StatusComponent"

class StatusComponent extends PureComponent<Props> {
    render() {
        Logger.log(TAG, "StatusComponent: ", this.props)
        const {item, callback} = this.props;
        let userView = <TouchableOpacity activeOpacity={0.7} style={styles.userContainer}
                                         onPress={() => {
                                             navigateN(NavigationManager.mainNavigation, "ProfilePage", {user: item.user})
                                         }}>
            <Image source={{uri: item.user.profile_image_url_large}}
                   style={styles.thumbnail}/>
            <View style={styles.userInfoContainer}>
                <View style={styles.userNameContainer}>
                    <Text style={styles.name}>{item.user.name}</Text>
                    <Text style={styles.unique_id}>{"@" + item.user.id}</Text>
                </View>
                <View style={styles.userNameContainer}>
                    <HTMLView
                        style={styles.source}
                        value={item.source}
                        onLinkPress={(url) => {
                            this.hrefDispatcher(url)
                        }}
                        stylesheet={{
                            p: styles.source,
                            a: styles.source,
                        }}
                    />
                    < Text style={styles.created_at}>{formatDate(new Date(item.created_at))}</Text>
                </View>
            </View>
        </TouchableOpacity>

        let statusView =
            <TouchableOpacity activeOpacity={0.7} style={styles.msgContainer} onPress={() => {
                if (callback) {
                    callback()
                } else {
                    navigateN(NavigationManager.mainNavigation, "StatusDetailPage", {item: item})
                }
            }}>
                <HTMLView
                    value={'<p>' + item.text + "</p>"}
                    onLinkPress={(url) => this.hrefDispatcher(url)}
                    stylesheet={{
                        p: styles.text,
                        a: [styles.text, {color: this.props.theme.brand_primary}],
                    }}/>
                {item.photo &&
                <TouchableOpacity activeOpacity={0.7}
                                  style={{
                                      width: screenWidth * 0.7,
                                      marginTop: 5,
                                  }}
                                  onPress={() => {
                                      navigateN(NavigationManager.mainNavigation, "PictureViewPage", {images: [{url: item.photo.largeurl}]})
                                  }}>
                    <AutoHeightImage width={screenWidth * 0.8}
                                     height={screenWidth * 0.8 * 0.618}
                                     source={{uri: item.photo.largeurl}}
                                     style={styles.msgImage}/>
                </TouchableOpacity>}
            </TouchableOpacity>
        return <View style={styles.container}>
            {userView}
            {statusView}
        </View>
    }

    hrefDispatcher = (url) => {
        Logger.log(TAG, "hrefDispatcher: " + url)
        // <a href="http://fanfou.com/dailu321" className="former">*/
        if (FanfouUtil.isProfileUrl(url)) {
            navigateN(NavigationManager.mainNavigation, "ProfilePage", {url: url})

        }
        // "#<a href="/q/%E6%B5%8B%E8%AF%95">测试</a>#"
        else if (url.indexOf('/q/') == 0) {
            navigateN(NavigationManager.mainNavigation, "SearchScreen", {url: url})
        }
        // "<a href="https://mp.weixin.qq.com/s/5LToZDjXlVmTZnj0kgApUg" title="https://mp.weixin.qq.com/s/5LToZDjXlVmTZnj0kgApUg" rel="nofollow" target="_blank">https://mp.weixin.qq.com/s/5LToZDjXlVmTZnj0kgApUg</a>"
        else {
            navigateN(NavigationManager.mainNavigation, "WebPage", {url: url})
        }
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    thumbnail: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f0f0',
    },
    userContainer: {
        flexDirection: 'row',
    },
    userInfoContainer: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 13,
        color: '#333333',
    },
    unique_id: {
        marginLeft: 5,
        fontSize: 13,
        color: '#CCCCCC',
    },
    created_at: {
        marginLeft: 10,
        fontSize: 14,
        color: '#777777',
    },
    source: {},

    msgContainer: {
        marginTop: 10,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'left',
    },
    msgImage: {
        backgroundColor: '#EEEEEE'
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(StatusComponent)
