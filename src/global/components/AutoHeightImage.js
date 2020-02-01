import React, {PureComponent} from "react";
import {Image} from "react-native";
import PropTypes from 'prop-types';

export default class AutoHeightImage extends PureComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     source: this.props.source,
        //     width: this.props.width,
        //     height: this.props.width * 0.618,
        // };
    }

    componentWillMount() {
        // Image.getSize(this.props.source.uri, (width, height) => {
        //     if (this.props.width && !this.props.height) {4
        //         let heightScaled = height * (this.props.width / width)
        //         heightScaled = heightScaled > this.props.width * 1.5 ? this.props.width *  1.5 : heightScaled
        //         this.setState({
        //             width: this.props.width,
        //             height: heightScaled
        //         });
        //     } else if (!this.props.widsth && this.props.height) {
        //         this.setState({
        //             width: width * (this.props.height / height),
        //             height: this.props.height
        //         });
        //     } else {
        //         this.setState({width: width, height: height});
        //     }
        // });
    }

    render() {
        return (
            <Image
                resizeMode={'contain'}
                source={this.props.source}
                style={{
                    marginLeft: 10, height: this.props.height, width: this.props.width
                }}
            />
        );
    }
}

AutoHeightImage.propTypes = {
    source: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
};
