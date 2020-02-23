import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../global/navigator/NavigationBar";

class MessageScreen extends React.Component {

    componentWillMount() {
        console.log('MessageScreen componentWillMount', this.props);
    }

    render() {
        const {theme} = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar//app标题栏
            title={'消息'}
            statusBar={statusBar}//状态栏配置
            style={theme.styles.navBar}//颜色遵循主题的
            // rightButton={this.renderRightButton()}//标题栏右边按钮
        />;
        return <View style={styles.container}>
            {navigationBar}
            <Text>test</Text>
        </View>
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
)(MessageScreen)
