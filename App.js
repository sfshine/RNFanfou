import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import store from './src/global/redux/ConfigStore';
import {AppContainer} from './src/global/navigator/RootNavigator';
import {Provider as ProviderANTD} from '@ant-design/react-native';
import ANTDThemeConfig from './src/global/antd/ANTDThemeConfig';
import InitHelper from './src/global/util/InitHelper';

export default class App extends PureComponent {
    constructor(props) {
        super(props);
        InitHelper.init(GLOBAL).catch()
    }

    render() {
        return (
            <Provider store={store}>
                <ProviderANTD theme={ANTDThemeConfig}>
                    <AppContainer/>
                </ProviderANTD>
            </Provider>
        );
    }
}
