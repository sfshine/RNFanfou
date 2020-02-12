import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import PublicPage from "../home/public/PublicCmpt";
import Icon from 'react-native-vector-icons/EvilIcons';
import PageCmpt from "~/global/components/PageCmpt";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";

class DiscoveryFragment extends React.Component {

    componentWillMount() {
        console.log('SearchScreen componentWillMount', this.props);
    }

    render() {
        return <PageCmpt title="发现">
            <PublicPage/>
        </PageCmpt>
    }


    renderRightButton() {
        return (<TouchableOpacity
                onPress={() => {
                    navigateN(NavigationManager.mainNavigation, "SearchScreen")
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
)(DiscoveryFragment)
