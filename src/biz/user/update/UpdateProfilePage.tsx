import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import PageCmpt from "~/global/components/PageCmpt";
import UpdateProfileAction from "./UpdateProfileAction";
import * as React from "react";
import {Button, InputItem, List, TextareaItem} from "@ant-design/react-native";
import {GlobalCache} from "~/global/AppGlobal";
import Logger from "~/global/util/Logger";
import {goBack} from "~/global/navigator/NavigationManager";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {getLocation} from "~/global/util/LocationUtil";

/**
 * @author Alex
 * @date 2020/04/04
 */
interface Props {
    navigation: object;
}

interface State {
    user: any
}

class UpdateProfilePage extends React.PureComponent<Props, State> {
    static defaultProps = {
        actionData: []
    }

    constructor(props) {
        super(props);
        this.state = {
            user: GlobalCache.user
        }
    }

    render() {
        return <PageCmpt title="个人资料修改" backNav={this.props.navigation}>
            {this.renderContent()}
        </PageCmpt>
    }

    renderContent = () => {
        return <List>
            <InputItem
                value={this.state.user.name}
                onChange={value => {
                    this.setState({
                        user: {
                            ...this.state.user,
                            name: value
                        }
                    });
                }}
            >
                用户名
            </InputItem>
            <InputItem
                value={this.state.user.location}
                editable={false}
                extra={<TouchableOpacity onPress={() => {
                    getLocation((location) => {
                        this.setState({
                            user: {
                                ...this.state.user,
                                location: location
                            }
                        });
                    }, () => {

                    }).catch()
                }}>
                    <EvilIcons name={'location'} size={24}/>
                </TouchableOpacity>}
            >
                位置
            </InputItem>
            <TextareaItem
                rows={4}
                placeholder="描述"
                autoHeight
                value={this.state.user.description}
                onChange={value => {
                    this.setState({
                        user: {
                            ...this.state.user,
                            description: value
                        }
                    });
                }}
                style={{margin: 5}}
            />
            <List.Item>
                <Button
                    style={{height: 43}}
                    type="primary"
                    onPress={() => {
                        UpdateProfileAction.updateProfile(this.state.user)
                            .then(() => goBack(this.props)).catch()
                    }}
                >确认更改
                </Button>
            </List.Item>
        </List>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        actionData: state.UpdateProfileReducer.actionData,
    }),
    (dispatch) => ({})
)(UpdateProfilePage)
