import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import * as React from "react";
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigate, navigateN} from "~/global/navigator/NavigationManager";
import TimelineCmpt from "~/biz/timeline/TimelineCmpt";

/**
 * @author Alex
 * @date 2020/02/01
 */
interface Props extends BaseProps {
}

interface State {
    name: string
}

const screenWidth = Dimensions.get('window').width;

class HomeFragment extends React.PureComponent<Props, State> {
    static defaultProps = {
        actionData: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
    }

    render() {
        const {theme} = this.props;
        return <PageCmpt title="主页"
                         rightNavButtonConfig={[{
                             icon: "md-search",
                             callback: () => navigateN(NavigationManager.mainNavigation, "SearchPage")
                         }, {
                             icon: "md-add",
                             callback: () => navigateN(NavigationManager.mainNavigation, "ComposePage")
                         }
                         ]}>
            <TimelineCmpt/>
        </PageCmpt>
    }

    compose = () => {
        navigateN(NavigationManager.mainNavigation, "ComposeScreen")
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    composeButton: {
        borderRadius: 35,
        shadowRadius: 8,
        shadowColor: '#aaaaaa',
        shadowOpacity: 0.6,
        shadowOffset: {width: 0, height: 3},
        width: 45,
        height: 45,
        zIndex: 100,
        position: 'absolute',
        left: screenWidth - 55,
        bottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(HomeFragment)
