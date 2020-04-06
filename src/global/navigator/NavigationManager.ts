import {NavigationActions, StackActions} from 'react-navigation';
import TipsUtil from "~/global/util/TipsUtil";

export default class NavigationManager {
    static mainNavigation;
}


export function navigate(props, page, params?) {
    const {navigation} = props;
    navigateN(navigation, page, params)
}

export function navigateN(navigation, page, params?) {
    if (navigation) {
        navigation.navigate(
            {
                key: page + Math.random() * 10000,
                routeName: page,
                params: params ? {...params} : {}
            }
        )
    } else {
        TipsUtil.toastFail("跳转页面失败")
    }
}

export function navigateResetN(navigation, page) {
    let resetAction = StackActions.reset({//清空 stack
        index: 0,
        actions: [
            NavigationActions.navigate({routeName: page})
        ]
    });
    navigation.dispatch(resetAction);
}

export function goBack(props) {
    const {navigation} = props;
    return goBackN(navigation)
}

export function goBackN(navigation) {
    if (navigation) {
        navigation.goBack();
        return true
    }
    return false
}

export function extractParam(props, key) {
    return props.navigation && props.navigation.state.params[key]
}
