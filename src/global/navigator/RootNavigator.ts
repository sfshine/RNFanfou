import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack";
import WelcomePage from "~/biz/welcome/WelcomePage";
import WebPage from "~/global/components/WebPage";
import LoginPage from "~/biz/user/login/LoginPage";
import MainPage from "~/biz/main/MainPage";

const RootNavigator = createStackNavigator({
        WelcomePage: {
            screen: WelcomePage
        },
        WebPage: {
            screen: WebPage
        }, LoginPage: {
            screen: LoginPage
        },
        MainPage: {
            screen: MainPage
        }
    }, {
        defaultNavigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        },
    }
);
export const AppContainer = createAppContainer(RootNavigator);
