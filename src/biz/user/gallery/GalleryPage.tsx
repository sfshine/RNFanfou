import {StyleSheet, Image, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import GalleryAction from "./GalleryAction";
import * as React from "react";
import BaseProps from "~/global/base/BaseProps";
import RefreshGridViewFlickr from "~/global/components/refresh/RefreshGridViewFlickr";
import Logger from "~/global/util/Logger";

/**
 * @author Alex
 * @date 2020/02/22
 */
interface Props extends BaseProps {
    actionData: [];
    onPageLoaded: Function;
    ptrState: string,
}

interface State {
    name: string
}

const TAG = "GalleryPage"
const action = new GalleryAction()

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
        return <PageCmpt title="Gallery页" backNav={this.props.navigation}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        return <RefreshGridViewFlickr
            data={this.props.actionData}
            ptrState={this.props.ptrState}
            onHeaderRefresh={() => this.props.onPageLoaded(this.user.id)}
            onFooterRefresh={
                () => {
                }
            }
            renderItem={this.renderItem}>
        </RefreshGridViewFlickr>
    }

    renderItem = (data) => {
        Logger.log(TAG, "data", data)
        return <View style={{alignItems: "center", margin: 2}}>
            <Image
                style={{
                    width: 150,
                    height: 90,
                    alignSelf: "center",
                }}
                source={{uri: data.item.photo.largeurl}}/>
        </View>
    }
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        actionData: state.GalleryReducer.actionData,
        ptrState: state.GalleryReducer.ptrState,
    }),
    (dispatch) => ({
        onPageLoaded: (userId) => dispatch(action.onPageLoaded(userId))
    })
)(GalleryPage)
