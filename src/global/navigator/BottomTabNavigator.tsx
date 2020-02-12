import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import {createBottomTabNavigator} from 'react-navigation-tabs';


import MePage from '../../biz/test/main/me/MePage';
import HomeFragment from '../../biz/main/home/HomeFragment';
import BaseProps from "~/global/base/BaseProps";
import DiscoveryFragment from "~/biz/discovery/DiscoveryFragment";

const TABS = {
    HomeFragment: {
        screen: HomeFragment,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon: ({tintColor, focused}) => (
                <Image style={{height: 20, width: 20}}
                       source={focused ?
                           require('#shouye.png') : require('#shouye1.png')}/>
            ),
        },
    },
    DiscoveryFragment: {
        screen: DiscoveryFragment,
        navigationOptions: {
            tabBarLabel: '发现',
            tabBarIcon: ({tintColor, focused}) => (
                <Image style={{height: 20, width: 20}}
                       source={focused ?
                           require('#dianpu.png') : require('#dianpu1.png')}/>
            ),
        },
    },
    MePage: {
        screen: MePage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Image style={{height: 20, width: 20}}
                       source={focused ?
                           require('#wode.png') : require('#wode1.png')}/>
            ),
        },
    },
};

class BottomTabNavigator extends PureComponent<BaseProps> {
    private Tabs: any;

    constructor(props) {
        super(props);
    }

    initBottomNavigator() {
        if (this.Tabs) {
            return this.Tabs;
        }
        console.log('_initBottomNavigator init', TABS);
        return this.Tabs = createAppContainer(createBottomTabNavigator(
            TABS,
            {
                // swipeEnabled: false, //Android用
                tabBarOptions: {
                    showIcon: true,
                    showLabel: true,
                    activeTintColor: this.props.theme.brand_primary,
                    inactiveTintColor: '#707070',
                },
            },
        ));
    }

    render() {
        console.log('Bottom Tab render');
        const Tab = this.initBottomNavigator();
        // return <Icon name={'home'} size={24} style={'#FF00FE'}/>
        return <Tab onNavigationStateChange={(prevState, newState, action) => {//TAB切换事件

        }}/>;
    }
}

const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(BottomTabNavigator);
