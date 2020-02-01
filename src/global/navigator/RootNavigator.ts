import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack";
import TestMainPage from "~/biz/test/main/TestMainPage";
import WelcomePage from "~/biz/test/welcome/WelcomePage";
import $FunNamePage from "../../biz/test/ideaplugin/$FunNamePage";
import DetailPage from "../../biz/test/detail/DetailPage";
import WebPage from "~/global/components/WebPage";

const RootNavigator = createStackNavigator({
        WelcomePage: {
            screen: WelcomePage
        },
        TestMainPage: {
            screen: TestMainPage
        },
        $FunNamePage: {
            screen: $FunNamePage
        },
        DetailPage: {
            screen: DetailPage
        },
        WebPage: {
            screen: WebPage
        }
    }, {
        defaultNavigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        },
    }
);
export const AppContainer = createAppContainer(RootNavigator);
