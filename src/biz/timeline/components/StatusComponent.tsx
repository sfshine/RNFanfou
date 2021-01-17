import React, {PureComponent} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AutoHeightImage from "~/global/components/AutoHeightImage";
import HTMLView from 'react-native-htmlview';
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import {formatDateStr} from "~/global/util/DateUtil";
import Logger from "~/global/util/Logger";
import {FanfouUtil} from "~/biz/common/util/FanfouUtil";
import {connect} from "react-redux";
import Row from "~/global/components/element/Row";
import Ionicons from 'react-native-vector-icons/Ionicons'

const screenWidth = Dimensions.get('window').width;

interface Props extends BaseProps {
    item: any,
    onItemClick: any,
    onLongPress: () => {},
}

const TAG = "StatusComponent"

class StatusComponent extends PureComponent<Props> {
    render() {
        Logger.log(TAG, "StatusComponent: ", this.props)
        const {item, onItemClick} = this.props;
        let userView = <TouchableOpacity activeOpacity={0.7} style={styles.userContainer}
                                         onPress={() => {
                                             navigateN(NavigationManager.mainNavigation, "ProfilePage", {user: item.user})
                                         }}>
            <Row style={{flex: 1}}>
                <Image source={{uri: item.user.profile_image_url_large}}
                       style={styles.thumbnail}/>
                <View style={styles.userInfoContainer}>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.name}>{item.user.name}</Text>
                        {item.location ? <Row>
                            <Text style={styles.location}>{item.location}</Text>
                            <Ionicons name={"ios-pin"} size={16} style={[styles.location, {marginLeft: 5}]}/>
                        </Row> : null}
                    </View>
                    <Row>
                        <HTMLView
                            style={styles.source}
                            value={item.source}
                            onLinkPress={(url) => {
                                this.hrefDispatcher(url)
                            }}
                            stylesheet={{
                                p: styles.source,
                                a: styles.source,
                                b: styles.source,
                            }}
                        />
                        < Text style={styles.created_at}>{formatDateStr(item.created_at)}</Text>
                    </Row>
                </View>
            </Row>
        </TouchableOpacity>

        let statusView =
            <TouchableOpacity activeOpacity={0.7} style={styles.msgContainer}
                              onLongPress={this.props.onLongPress}
                              onPress={() => {
                                  if (onItemClick) {
                                      onItemClick()
                                  } else {
                                      navigateN(NavigationManager.mainNavigation, "StatusDetailPage", {item: item})
                                  }
                              }}>
                {item.text ? <HTMLView
                    value={'<p>' + item.text + "</p>"}
                    onLinkPress={(url) => this.hrefDispatcher(url)}
                    stylesheet={{
                        p: styles.text,
                        a: [styles.text, {color: this.props.theme.brand_primary}],
                        b: [styles.text, {color: "#FF0000"}],
                    }}/> : null}
                {this.renderImage(item)}
            </TouchableOpacity>
        return <View style={styles.container}>
            {userView}
            {statusView}
        </View>
    }

    renderImage = (item) => {
        if (item.photo) {
            if (!item.photo.imageurl && !item.photo.largeurl) {
                return null
            }
            let imageUrl = item.photo.largeurl
            if (imageUrl.endsWith(".gif")) {
                //I am gif, will use largeurl
            } else {
                imageUrl = item.photo.imageurl
            }
            return <TouchableOpacity activeOpacity={0.7}
                                     style={{
                                         width: screenWidth * 0.7,
                                         marginTop: 5,
                                     }}
                                     onPress={() => {
                                         navigateN(NavigationManager.mainNavigation, "PictureViewPage", {images: [{url: item.photo.largeurl}]})
                                     }}>
                <AutoHeightImage width={screenWidth * 0.8}
                                 height={screenWidth * 0.8 * 0.618}
                                 source={{uri: imageUrl}}
                                 style={styles.msgImage}/>
            </TouchableOpacity>
        } else {
            return null
        }
    }
    hrefDispatcher = (url) => {
        Logger.log(TAG, "hrefDispatcher: " + url)
        // <a href="http://fanfou.com/dailu321" className="former">*/
        if (FanfouUtil.isProfileUrl(url)) {
            navigateN(NavigationManager.mainNavigation, "ProfilePage", {url: url})

        }
        // "#<a href="/q/%E6%B5%8B%E8%AF%95">测试</a>#"
        else if (url.indexOf('/q/') == 0) {
            navigateN(NavigationManager.mainNavigation, "SearchPage", {url: url})
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
        flex: 1,
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    name: {
        fontSize: 14,
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
    location: {
        fontSize: 12,
        color: '#777777',
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(StatusComponent)
