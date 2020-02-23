import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

export interface ButtonConfig {
    icon?: string;
    text?: string;
    callback: Function;
}

export default class NavigationBarViewFactory {
    static createButtonGroups(buttonGroupConfig: ButtonConfig[]) {
        if (buttonGroupConfig) {
            if (buttonGroupConfig.length == 1) {
                return this.createButton(buttonGroupConfig[0])
            } else {
                return <View style={{flexDirection: 'row',}}>
                    {buttonGroupConfig.map((config) => this.createButton(config))}
                </View>
            }
        } else {
            return null
        }
    }

    static createButton(config: ButtonConfig) {
        if (config.icon) {
            return this.createButtonWithView(
                <AntDesign name={config.icon} size={24} style={{color: 'white'}}/>, config.callback)
        } else {
            return this.createButtonWithView(
                <Text style={{fontSize: 15, color: '#FFFFFF'}}>{config.text}</Text>, config.callback)
        }
    }


    static createButtonWithView(view, callBack) {
        return <TouchableOpacity
            style={{alignItems: "center", justifyContent: "center", width: 40}}
            onPress={callBack}>
            {view}
        </TouchableOpacity>
    }
}
