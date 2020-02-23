import {Image, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import GalleryAction from "./GalleryAction";
import * as React from "react";
import BaseProps from "~/global/base/BaseProps";
import RefreshGridViewFlickr from "~/global/components/refresh/RefreshGridViewFlickr";
import Logger from "~/global/util/Logger";
import {screenWidth} from "~/global/util/ScreenUtil";
import {navigate} from "~/global/navigator/NavigationManager";

/**
 * @author Alex
 * @date 2020/02/22
 */
interface Props extends BaseProps {
    actionData: any[];
    onPageLoaded: Function;
    loadMore: Function;
    ptrState: string,
}

interface State {
    name: string
}

const TAG = "GalleryPage"
const action = new GalleryAction()
const picPadding = 2
const picWidth = screenWidth / 3 - 10

class GalleryPage extends React.PureComponent<Props, State> {
    static defaultProps = {
        actionData: []
    }
    private readonly user

    constructor(props) {
        super(props);
        this.user = this.props.navigation.state.params.user
    }

    componentDidMount(): void {
        this.props.onPageLoaded(this.user.id)
    }

    render() {
        return <PageCmpt title={`${this.user.name}的相册`}
                         backNav={this.props.navigation}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        return <RefreshGridViewFlickr
            style={{alignSelf: "center", width: (picWidth * 3 + picPadding * 6)}}
            data={this.props.actionData}
            ptrState={this.props.ptrState}
            onHeaderRefresh={() => this.props.onPageLoaded(this.user.id)}
            onFooterRefresh={() => this.props.loadMore(this.user.id, this.props.actionData)}
            renderItem={this.renderItem}>
        </RefreshGridViewFlickr>
    }

    renderItem = (data) => {
        Logger.log(TAG, "data", data)
        return <TouchableOpacity style={{alignItems: "center", margin: picPadding}} onPress={
            () => {
                // images
                navigate(this.props, "MultiplePictureViewPage", {pageData: this.props.actionData, index: data.index})
            }
        }>
            <Image
                style={{
                    width: picWidth,
                    height: picWidth,
                }}
                source={{uri: data.item.photo.largeurl}}/>
        </TouchableOpacity>
    }
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        actionData: state.GalleryReducer.actionData,
        ptrState: state.GalleryReducer.ptrState,
    }),
    (dispatch) => ({
        onPageLoaded: (userId) => dispatch(action.onPageLoaded(userId)),
        loadMore: (userId, pageData) => dispatch(action.loadMore(userId, pageData))
    })
)(GalleryPage)
