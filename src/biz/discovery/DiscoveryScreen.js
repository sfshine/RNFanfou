import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import NavigationBar from "../../global/navigator/Navigationbar";
import NavigationUtil from "../../global/navigator/NavigationUtil";
import PublicPage from "../home/public/PublicPage";
import Icon from 'react-native-vector-icons/EvilIcons';

class DiscoveryScreen extends React.Component {

    componentWillMount() {
        console.log('SearchScreen componentWillMount', this.props);
    }

    render() {
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            enableLeftButton={false}
            title={'探索'}
            style={theme.styles.navBar}//颜色遵循主题的
            backPress={this.goBack}
            rightButton={this.renderRightButton()}
        />;
        return <View style={styles.container}>
            {navigationBar}
            <PublicPage/>
        </View>
    }

    goBack = () => NavigationUtil.goBack(this.props)

    renderRightButton() {
        return (<TouchableOpacity
                onPress={() => {
                    NavigationUtil.fromMainToPage("SearchScreen")
                }}>
                <Icon
                    name={'search'}
                    size={26}
                    style={{color: 'white', marginRight: 20}}
                />
            </TouchableOpacity>
        )
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
)(DiscoveryScreen)