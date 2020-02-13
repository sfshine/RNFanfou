import React from 'react';
import {Alert, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StatusComponent from '../timeline/components/StatusComponent';
import TimelineCell from '../timeline/TimelineCell';
import RefreshListView from '../../global/components/refresh/RefreshListView';
import StatusDetailAction from './StatusDetailAction';
import {removeHtmlTag} from '../../global/util/StringUtil';
import BaseProps from "~/global/base/BaseProps";
import PageCmpt from "~/global/components/PageCmpt";
import {COMPOSE_MODE} from "~/biz/compose/QuickComposeAction";
import {GlobalCache} from "~/global/AppGlobal";
import RefreshState from "~/global/components/refresh/RefreshState";
import Logger from "~/global/util/Logger";

interface Props extends BaseProps {
    refreshContextTimeline: Function,
    unLoadStatusCache: Function,
    pageData: [],
    ptrState: string,
    headerStatus: any,
}

interface State {
}

const TAG = "StatusDetailPage"

class StatusDetailPage extends React.Component<Props, State> {
    private readonly statusFromPreviousPage

    constructor(props) {
        super(props);
        this.statusFromPreviousPage = this.props.navigation.state.params.item
    }

    componentWillMount() {
        this.props.refreshContextTimeline(this.statusFromPreviousPage);
    }

    componentWillUnmount(): void {
        this.props.unLoadStatusCache()
    }

    render() {
        let {pageData, ptrState, headerStatus} = this.props
        pageData = pageData ? pageData : []
        headerStatus = headerStatus ? headerStatus : this.statusFromPreviousPage
        ptrState = ptrState ? ptrState : RefreshState.Idle

        return <PageCmpt title="状态详情" backNav={this.props.navigation}>
            <RefreshListView
                ListHeaderComponent={() => this._renderHeader(headerStatus)}
                ListEmptyComponent={<View/>}
                data={pageData}
                ptrState={ptrState}
                renderItem={data => this._renderItem(data, headerStatus)}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    this.props.refreshContextTimeline(headerStatus.id);
                }}
            />
            {this.renderToolbar(headerStatus)}
        </PageCmpt>
    }


    _renderHeader = (headerStatus) => {
        Logger.log(TAG, "_renderHeader", headerStatus)
        return headerStatus ? <View style={{backgroundColor: '#FFFFFF', paddingBottom: 5, marginBottom: 2}}>
            <StatusComponent item={headerStatus} callback={() => this._onStatusClick(headerStatus)}/>
        </View> : null;
    };

    _renderItem = (data, headerStatus) => {
        let item = data.item;
        return (
            <TimelineCell
                highLight={headerStatus.id != this.statusFromPreviousPage.id && this.statusFromPreviousPage.id == item.id}
                item={item}
                callback={() => this._onStatusClick(item)}/>
        );
    };
    _onStatusClick = (status) => {
        this.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Comment});
    };

    renderToolbar(status) {
        const {theme} = this.props;
        return <View style={[styles.toolsContainer, {backgroundColor: theme.brand_primary}]}>
            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                this.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Comment});
            }
            }>
                <AntDesign name={'message1'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                this.onShowQuickCompose({status: status, mode: COMPOSE_MODE.Forward});
            }}>
                <AntDesign name={'retweet'} size={25} style={{color: 'white'}}/>
            </TouchableOpacity>

            {status.user && status.user.id === GlobalCache.user.id ?
                <TouchableOpacity style={styles.toolsButton} activeOpacity={0.7} onPress={() => {
                    Alert.alert('提示', `确定删除:${removeHtmlTag(status.text)}?`,
                        [
                            {
                                text: '取消', onPress: () => {

                                },
                            },
                            {
                                text: '确定', onPress: () => {
                                    StatusDetailAction.statuses_destroy(status.id, this.props.navigation)
                                },
                            },
                        ]);
                }}>
                    <AntDesign name={'delete'} size={25} style={{color: 'white'}}/>
                </TouchableOpacity> : null}
        </View>;
    }

    private onShowQuickCompose(param: { status: any; mode: string }) {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        justifyContent: 'space-between',
    },
    top: {
        margin: 10,
        justifyContent: 'center',
    },
    toolsContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    toolsButton: {
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#F0F0F0',
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        headerStatus: state.StatusDetailReducer.headerStatus,
        pageData: state.StatusDetailReducer.pageData,
        ptrState: state.StatusDetailReducer.ptrState,
        msg_id: state.StatusDetailReducer.msg_id,
    }),
    (dispatch) => ({
        refreshContextTimeline: (status) => dispatch(StatusDetailAction.loadStatusContextTimeline(status)),
        unLoadStatusCache: () => dispatch(StatusDetailAction.unLoadStatusCache()),
    }),
)(StatusDetailPage);
