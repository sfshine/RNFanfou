import React, {PureComponent} from "react";
import * as action from "~/biz/discovery/public/PublicAction";
import {SearchAction} from "~/biz/search/SearchAction";
import {ResetRedux} from "~/biz/discovery/public/PublicReducer";
import {connect} from "react-redux";

/**
 * Android物理回退键处理
 */
interface Props {
    resetAction: object,
    clearRedux: Function
}

class ReduxResetComponent extends PureComponent<Props> {
    componentWillUnmount() {
        this.props.resetAction && this.props.clearRedux(this.props.resetAction)
    }

    render() {
        return null
    }
}

export default connect(
    null,
    (dispatch) => ({
        clearRedux: (resetAction) => dispatch(resetAction)
    })
)
(ReduxResetComponent)
