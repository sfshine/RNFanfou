import {StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import DetailAction from "./DetailAction";
import * as React from "react";

/**
 * @author Alex
 * @date 2020/01/31
 */
interface Props {
    navigation: object;
    actionData: object;
    onPageLoaded: Function;
}

interface State {
    name: string
}

class DetailPage extends React.PureComponent<Props, State> {
    static defaultProps = {
        actionData: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        this.props.onPageLoaded(0)
    }

    render() {
        return <PageCmpt title="Detail页" backNav={this.props.navigation}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        return <View><Text>{JSON.stringify(this.props.actionData)}</Text></View>
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
        actionData: state.DetailReducer.actionData,
    }),
    (dispatch) => ({
        onPageLoaded: (pageNum) => dispatch(DetailAction.onPageLoaded(pageNum))
    })
)(DetailPage)
