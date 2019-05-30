import React, { Component } from 'react';

import { debounce } from 'lodash'
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  View
} from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'

Amplify.configure({ Auth: awsConfig });

const styles = require('./ProfileStyles');

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      username: '',
      resetCode: '',
      newPassword: '',
      errorMessage: '',
      resetPassword: false,
      recoverButtonText: 'RECOVER',
    };
    this.resetPassword = this.resetPassword.bind(this);
  }
  async componentDidMount() {
    const info = await Auth.currentUserInfo()
    //console.log('Returned info: ', info)
    this.setState({ info })
    await this.loadApp()
  }
  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({userToken: user.signInUserSession.accessToken.jwtToken})
    })
    .catch(err => console.log(err))
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
  }
  resetPassword = () => {
    if (this.state.resetPassword === true) {
      Auth.forgotPasswordSubmit(this.state.username, this.state.resetCode, this.state.newPassword)
        .then(() => { this.props.navigation.navigate('Login') })
        .catch(err => { this.setState({ errorMessage: err.message }) });
    } else {
      Auth.forgotPassword(this.state.username)
        .then(() => { this.setState({ resetPassword: true }) })
        .catch(err => { this.setState({ errorMessage: err.message }) });
    }
  }

  resetPasswordFields = () => {
    return (
      <View>
        <TextInput
          style={styles.forgot_password_input}
          onChangeText={(resetCode) => this.setState({ resetCode })}
          placeholder="RESET CODE"
          autoCapitalize="none"
          onFocus={() => this.setState({ resetCode: "" })}
          keyboardType="numeric"
          underlineColorAndroid="#fff" />
        <TextInput
          style={styles.forgot_password_input}
          onChangeText={(newPassword) => this.setState({ newPassword })}
          placeholder="NEW PASSWORD"
          autoCapitalize="none"
          onFocus={() => { this.setState({ newPassword: "" }); this.setState({ recoverButtonText: 'RESET' }) }}
          secureTextEntry={true}
          underlineColorAndroid="#fff" />
      </View>
    )
  }
  // Confirm sign out
  signOut = async () => {
    await Auth.signOut()
    .then(() => {
      //console.log('Sign out complete')
      this.props.navigation.navigate('Signin')
    })
    .catch(err => console.log('Error while signing out!', err))
  }

  render() {
    const { info } = this.state
    const { username, gender, birthdate } = info
    return (
      <SafeAreaView style={{ alignItem: 'center',justifyContent:'center', width:'100%' ,height:'100%'}}>
        <TouchableOpacity onPress={this.signOut}>
          <Text style={{alignSelf:'center',color:'black',marginTop:60}}>Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}