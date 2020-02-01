import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckBox from 'react-native-check-box'
import Icon from "react-native-vector-icons/Ionicons";

export default class UserCell extends React.Component {
    render() {
        // console.log("UserCell: ", this.props)
        const {user, checkMap, showCheckBox} = this.props;
        return <TouchableOpacity activeOpacity={0.7} style={styles.userContainer} onPress={this.props.onPress}>
            <View style={styles.userInfoContainer}>
                <Image source={{uri: user.profile_image_url_large}} style={styles.thumbnail}/>
                <View style={styles.userNameContainer}>
                    <Text style={styles.name}>{user.name}</Text>
                    {user.description ?
                        <Text style={styles.description} numberOfLines={1}>{user.description}</Text>
                        : null}
                </View>
            </View>
            {
                showCheckBox ? <CheckBox
                    onClick={this.props.onPress}
                    isChecked={checkMap[user.name]}
                    checkedImage={this._checkedImage(true)}
                    unCheckedImage={this._checkedImage(false)}
                /> : null
            }
        </TouchableOpacity>
    }

    _checkedImage(checked) {
        const {theme} = this.props;
        return <Icon
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: theme.themeColor,
            }}/>
    }

}

const styles = StyleSheet.create({
    userContainer: {
        width: '100%',
        padding: 7,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 50,
        height: 50,
        backgroundColor: '#f0f0f0',
    },

    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userNameContainer: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    description: {
        marginTop: 5,
        fontSize: 14,
        color: '#333333',
        maxWidth: 250,
    },
    unique_id: {
        marginLeft: 5,
        fontSize: 13,
        color: '#CCCCCC',
    },
    created_at: {
        marginLeft: 10,
        fontSize: 14,
        color: '#777777',
    },
});
