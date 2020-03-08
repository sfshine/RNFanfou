import React from "react";
import BaseProps from "~/global/base/BaseProps";

export default class BaseComponent<P extends BaseProps, S> extends React.PureComponent<P, S> {
    componentWillUnmount(): void {

    }
}
