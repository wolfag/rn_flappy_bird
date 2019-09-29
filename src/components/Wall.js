import React, { Component } from 'react';
import { View } from 'react-native'

export default class Wall extends Component {
    render() {
        const { size, body: { position }, color } = this.props;
        const [width, height] = size
        const x = position.x - width / 2;
        const y = position.y - height / 2

        return (
            <View style={{ position: 'absolute', left: x, top: y, width, height, backgroundColor: color }} />
        )
    }
}
