import {NavigationActions, StackActions} from 'react-navigation';

export default class NavigationManager {
    static mainNavigation;
}


export function navigate(props, page, params?) {
    const {navigation} = props;
    navigateN(navigation, page, params)
}

export function navigateN(navigation, page, params?) {
    navigation.navigate(
        {
            key: page + Math.random() * 10000,
            routeName: page,
            params: params ? {...params} : {}
        }
    )
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

export function goBackN(navigation) {
    if (navigation) {
        navigation.goBack();
        return true
    }
    return false
}
