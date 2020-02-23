import {StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import * as React from "react";
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import TimelineCmpt from "~/biz/timeline/TimelineCmpt";
import AntDesign from 'react-native-vector-icons/AntDesign'
import {screenWidth} from "~/global/util/ScreenUtil";
import ComposeButton from "~/biz/main/cmpt/ComposeButton";

/**
 * @author Alex
 * @date 2020/02/01
 */
interface Props extends BaseProps {
}

interface State {
    name: string
}

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
        return <PageCmpt title="主页"
                         rightNavButtonConfig={[{
                             icon: "search1",
                             callback: () => navigateN(NavigationManager.mainNavigation, "SearchPage")
                         }
                         ]}>
            <TimelineCmpt/>
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
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(HomeFragment)
