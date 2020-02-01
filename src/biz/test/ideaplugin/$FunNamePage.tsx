import {StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import $FunNameAction from "./$FunNameAction";
import * as React from "react";

/**
 * @author $author
 * @date $date
 */
interface Props {
    navigation: object;
    actionData: object;
    onPageLoaded: Function;
}

interface State {
    name: string
}

class $FunNamePage extends React.PureComponent<Props, State> {
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
        return <PageCmpt title="$FunName页" backNav={this.props.navigation}>
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
        actionData: state.$FunNameReducer.actionData,
    }),
    (dispatch) => ({
        onPageLoaded: (pageNum) => dispatch($FunNameAction.onPageLoaded(pageNum))
    })
)($FunNamePage)
