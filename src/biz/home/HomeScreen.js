import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import TimelinePage from "../timeline/TimelineCmpt";
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationUtil from "../../global/navigator/NavigationUtil";
import NavigationBar from "../../global/navigator/Navigationbar";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // console.log('HomeScreen componentDidMount', this.props);
    }

    componentWillMount() {
        // console.log('HomeScreen componentWillMount', this.props);
    }

    render() {
        const {theme} = this.props;
        let navigationBar = <NavigationBar//app标题栏
            enableLeftButton={false}
            title={'动态'}
            style={theme.styles.navBar}//颜色遵循主题的
            backPress={this.goBack}
            rightButton={this.renderRightButton()}
        />;
        return <View style={styles.container}>
            {navigationBar}
            <TimelinePage/>
            <TouchableOpacity style={[styles.compose, {backgroundColor: theme.themeColor}]} activeOpacity={0.7}
                              onPress={this.compose}>
                <MaterialCommunityIcons style={{color: 'white'}} name={'plus'} size={35}/>
            </TouchableOpacity>
        </View>
    }

    compose = () => {
        NavigationUtil.fromMainToPage("ComposeScreen")
    }

    renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {
                        NavigationUtil.fromMainToPage("SearchScreen")
                    }}>
                    <Icon
                        name={'search'}
                        size={26}
                        style={{color: 'white', marginRight: 20}}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    compose: {
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
)(HomeScreen)
