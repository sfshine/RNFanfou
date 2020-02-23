import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from "react-redux";
import PublicPage from "../home/public/PublicCmpt";
import PageCmpt from "~/global/components/PageCmpt";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import BaseProps from "~/global/base/BaseProps";
import ComposeButton from "~/biz/main/cmpt/ComposeButton";

class DiscoveryFragment extends React.PureComponent<BaseProps> {

    componentWillMount() {
        console.log('SearchScreen componentWillMount', this.props);
    }

    render() {
        return <PageCmpt title="发现" rightNavButtonConfig={[{
            icon: "search1",
            callback: () => navigateN(NavigationManager.mainNavigation, "SearchPage")
        }, {
            icon: "plus",
            callback: () => navigateN(NavigationManager.mainNavigation, "ComposePage")
        }
        ]}>
            <PublicPage/>
            <ComposeButton/>
        </PageCmpt>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme
    }),
    (dispatch) => ({})
)(DiscoveryFragment)
