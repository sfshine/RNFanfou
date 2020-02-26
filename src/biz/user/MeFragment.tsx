import {connect} from "react-redux";
import * as React from "react";
import ProfilePage from "~/biz/user/profile/ProfilePage";
import {GlobalCache} from "~/global/AppGlobal";
import NavigationManager from "~/global/navigator/NavigationManager";

interface Props {
    actionData: object;
}

interface State {
}

export default class MeFragment extends React.PureComponent<Props, State> {

    render() {
        return <ProfilePage navigation={NavigationManager.mainNavigation} userFromMeFragment={GlobalCache.user}/>
    }
}
