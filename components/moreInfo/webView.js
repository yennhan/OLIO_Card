
import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons'

export default class MyWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      error: "The Page you are trying to load can't be loaded..please"
    };
  }

  hideSpinner = () => {
    this.setState({ visible: false });
  }
  showSpinner = () => {
    this.setState({ visible: true });
  }

  render() {
    var { url } = this.props.navigation.state.params.theLink
    return (
      <View style={{ flex: 1 }}>
         <View style={{ height: 70, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <TouchableOpacity style={{ top: (Platform.OS)==='ios' ? +30:0, marginLeft: 10, alignSelf: 'flex-start', height: 60 }} onPress={() => { this.props.navigation.goBack(null) }}>
          <Icon name="ios-arrow-round-back" size={50} color={'white'} />
        </TouchableOpacity>
      </View>
        <WebView
          onLoadStart={() => (this.showSpinner())}
          onLoad={() => this.hideSpinner()}
          style={{ flex: 1 }}
          source={{ uri: url }}
        />
        {this.state.visible && (
          <ActivityIndicator
            style={{
              flex: 1,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            size="large"
          />
        )}
      </View>
    );
  }
}