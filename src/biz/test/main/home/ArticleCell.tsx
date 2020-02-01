import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Row from "~/global/components/element/Row";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";

// {
//     apkLink: "",
//     audit: 1,
//     author: "",
//     canEdit: false,
//     chapterId: 502,
//     chapterName: "自助",
//     collect: false,
//     courseId: 13,
//     desc: "",
//     descMd: "",
//     envelopePic: "",
//     fresh: false,
//     id: 11646,
//     link: "https://www.jianshu.com/p/800480bf9f61",
//     niceDate: "1天前",
//     niceShareDate: "1天前",
//     origin: "",
//     prefix: "",
//     projectLink: "",
//     publishTime: 1580127617000,
//     selfVisible: 0,
//     shareDate: 1580127617000,
//     shareUser: "逐梦少年",
//     superChapterId: 494,
//     superChapterName: "广场Tab",
//     tags: [ ],
//     title: "浅谈Java开发规范与开发细节(上)",
//     type: 0,
//     userId: 29062,
//     visible: 1,
//     zan: 0
// },
interface Props {
    item: ArticleItem;
}

interface ArticleItem {
    id: number;
    title: string;
    shareUser: string;
    niceDate: string;
    link: string;
}

export default class ArticleCell extends PureComponent<Props, {}> {

    render() {
        let {item} = this.props;
        return <TouchableOpacity onPress={() => {
            navigateN(NavigationManager.mainNavigation, "WebPage", {url: item.link})
        }}>
            <Text style={{fontSize: 20}}>{item.id + ":" + item.title}</Text>
            <Row>
                <Text>{item.shareUser}</Text>
                <Text>{item.niceDate}</Text>
            </Row>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({});
