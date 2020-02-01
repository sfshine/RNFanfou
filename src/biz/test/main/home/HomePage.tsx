import {Button, Text, View} from 'react-native';
import {connect} from "react-redux";
import * as React from "react";
import PageCmpt from "~/global/components/PageCmpt";
import HomeAction from "./HomeAction";
import ArticleCell from "./ArticleCell"
import RefreshListView from "~/global/components/refresh/RefreshListView";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import Logger from "~/global/util/Logger";

const TAG = "HomePage"

interface Props {
    actionData: Array<any>;
    onPageRefresh: Function;
    onPageLoadMore: Function;
    ptrState: string;
    theme: object;
}

interface State {
}

class HomePage extends React.PureComponent<Props, State> {
    static defaultProps = {
        actionData: []
    }

    componentDidMount(): void {
        this.props.onPageRefresh()
    }

    render() {
        return <PageCmpt title="主页">
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent() {
        Logger.log(TAG, "HomePage render", this.props);
        return <RefreshListView
            ListHeaderComponent={this.renderHeader}
            data={this.props.actionData}
            ptrState={this.props.ptrState}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id.toString()}
            onHeaderRefresh={() => {
                console.log("onHeaderRefresh");
                this.props.onPageRefresh()
            }}
            onFooterRefresh={() => {
                this.props.onPageLoadMore(this.props.actionData)
            }}
        />
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <ArticleCell item={item}/>
        )
    };

    renderHeader = () => {
        return <Button onPress={() => {
            navigateN(NavigationManager.mainNavigation, "DetailPage")
        }} title={"进入详情"}/>
    }
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        actionData: state.homeReducer.actionData,
        ptrState: state.homeReducer.ptrState,
    }),
    (dispatch) => ({
        onPageRefresh: () => dispatch(HomeAction.onPageRefresh()),
        onPageLoadMore: (actionData) => dispatch(HomeAction.onPageLoadMore(actionData)),
    })
)(HomePage)
