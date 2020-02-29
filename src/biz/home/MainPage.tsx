import React from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "../../global/components/PageCmpt";
import TipsUtil from "~/global/util/TipsUtil";
import BottomTabNavigator from "~/global/navigator/BottomTabNavigator";
import NavigationManager from "~/global/navigator/NavigationManager";
import ConfirmExitHelper from "~/global/components/ConfirmExitHelper";

interface Props {
    navigation: object;
}

const confirmExitHelper = new ConfirmExitHelper()

class MainPage extends React.PureComponent<Props, {}> {

    constructor(props) {
        super(props);
        NavigationManager.mainNavigation = this.props.navigation
    }

    componentDidMount(): void {
    }

    render() {
        return <PageCmpt overrideBackPress={confirmExitHelper.overrideBackPress}>
            <BottomTabNavigator/>
        </PageCmpt>
    }

}

export default connect(
    (state) => ({}),
    (dispatch) => ({})
)(MainPage)
