import React, { Component } from 'react';
import { Animated } from 'react-native';
class AnimatedBar extends Component {
  constructor(props) {
    super(props);
    this._width = new Animated.Value(0);
    this.yTransalte
    this.state = {
      color: "#fff",
    };
  }

  componentDidMount() {
    this.animateTo(this.props.delay, this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    this.animateTo(nextProps.delay, nextProps.value);
  }

  animateTo = (delay, value) => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this._width, {
        toValue: value,
      }),
    ]).start();
  }

  render() {
    const barStyles = {
      backgroundColor: '#58D68D',
      height: this._width,
      width: 40,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      
    };
    return (
      <Animated.View style={barStyles} />
    );
  }
}

export default AnimatedBar;