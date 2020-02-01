import React from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "../../../global/components/PageCmpt";
import TipsUtil from "~/global/util/TipsUtil";
import BottomTabNavigator from "~/global/navigator/BottomTabNavigator";
import NavigationManager from "~/global/navigator/NavigationManager";

interface Props {
    navigation: object;
}

class TestMainPage extends React.PureComponent<Props, {}> {
    private canBack: boolean;

    constructor(props) {
        super(props);
        NavigationManager.mainNavigation = this.props.navigation
    }

    componentDidMount(): void {
    }

    render() {
        return <PageCmpt style={styles.container} overrideBackPress={this.overrideBackPress}>
            <BottomTabNavigator/>
        </PageCmpt>
    }

    overrideBackPress = () => {
        if (this.canBack) {
            BackHandler.exitApp();
        } else {
            TipsUtil.toast("再按一次退出")
            this.canBack = true
            setTimeout(() => this.canBack = false, 3000)
        }
        return true
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default connect(
    (state) => ({
    }),
    (dispatch) => ({})
)(TestMainPage)
