import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import LottieView from 'lottie-react-native';
Amplify.configure({Auth: awsConfig});


const styles = require('./SigninStyles');
// Fetch the token from storage then navigate to our appropriate place


export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
    this.signInUser = this.signInUser.bind(this);
  }
  componentDidMount = async () => {
    await this.loadApp()
  }
  async loadApp() {
    await Auth.currentAuthenticatedUser()
    .then(user => {
      console.log(user)
      this.props.navigation.navigate('tabs',user)
    })
    .catch(err => console.log(err))
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
  }
  signInUser = () => {
    Auth.signIn (this.state.email, this.state.password)
      .then(user => {
        this.setState({ user })
        this.props.navigation.navigate('tabs', user)})
      .catch(err => { this.setState({ errorMessage: err.message }) });
    console.log('success');
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={styles.fullSize}
        behavior = "padding"
      >
        <ScrollView
          contentContainerStyle={styles.signin_container}
          keyboardShouldPersistTaps='never'
          scrollEnabled={false}
        >
          <View style={styles.signin_form_container}>
          <Text style={styles.signin_banner_text}>
              OLIO
            </Text>
            <Text>
              {this.state.errorMessage}
            </Text>
            <TextInput
              style={styles.signin_input}
              onChangeText = {(email) => this.setState({email})}
              value = {this.state.email}
              placeholder = "EMAIL ADDRESS"
              autoCapitalize = "none"
              onFocus = { () => this.setState({email: ""})}
              underlineColorAndroid = "#fff"
            />
            <TextInput
              style={styles.signin_input}
              onChangeText = {(password) => this.setState({password})}
              value = {this.state.password}
              placeholder = "PASSWORD"
              autoCapitalize = "none"
              onFocus = { () => this.setState({password: ""})}
              secureTextEntry = {true}
              underlineColorAndroid = "#fff"
            />
          </View>
          <View style={styles.signin_actions_container}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.signup_button}>
                DON'T HAVE AN ACCOUNT?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={styles.signup_button}>
                FORGOT PASSWORD?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.signInUser}
              style={styles.signin_button}
            >
              <Text style={styles.signin_button_text}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}