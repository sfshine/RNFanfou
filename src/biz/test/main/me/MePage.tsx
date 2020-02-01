import {Button} from 'react-native';
import {connect} from "react-redux";
import * as React from "react";
import PageCmpt from "~/global/components/PageCmpt";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";

interface Props {
    actionData: object;
}

interface State {
}

class MePage extends React.PureComponent<Props, State> {
    private navButtonConfigs = {
        text: "退出",
        callback: () => {
        }
    }

    componentDidMount(): void {
    }

    render() {
        return <PageCmpt title="个人中心" rightNavButtonConfig={this.navButtonConfigs}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        return <Button onPress={() => {
            navigateN(NavigationManager.mainNavigation, "TestDetailPage")
        }} title={"进入详情"}/>
    }
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
    }),
    (dispatch) => ({})
)(MePage)
