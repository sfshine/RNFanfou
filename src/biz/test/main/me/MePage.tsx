import {Button} from 'react-native';
import {connect} from "react-redux";
import * as React from "react";
import PageCmpt from "~/global/components/PageCmpt";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import ProfilePage from "~/biz/user/profile/ProfilePage";
import {GlobalCache} from "~/global/AppGlobal";

interface Props {
    actionData: object;
}

interface State {
}

export default class MePage extends React.PureComponent<Props, State> {

    render() {
        return <ProfilePage userFromMePage={GlobalCache.user}/>
    }
}
