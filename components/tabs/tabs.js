import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import Icon from 'react-native-vector-icons/Ionicons'

Amplify.configure({Auth: awsConfig});
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View } from 'react-native';
import Profile from '../Profile/Profile'
import Home from '../home/home'
import Invest from '../invest/investScreen'
import myPortfolio from '../Portfolio/portfolio'

class HomeScreen extends React.Component {
    state = {
        userToken: null
      }
      async componentDidMount () {
        await this.loadApp()
      }
      // Get the logged in users and remember them
      loadApp = async () => {
        await Auth.currentAuthenticatedUser()
        .then(user => {
          this.setState({userToken: user.signInUserSession.accessToken.jwtToken})
        })
        .catch(err => console.log(err))
        this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
      }
  
  render() {
    const { userToken } = this.state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!
            {userToken}
        </Text>
      </View>
    );
  }
}
class SettingsScreen extends React.Component {
  // Confirm sign out
  signOut = async () => {
    await Auth.signOut()
    .then(() => {
      console.log('Sign out complete')
      this.props.navigation.navigate('Signin')
    })
    .catch(err => console.log('Error while signing out!', err))
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
        <TouchableOpacity
  onPress={this.signOut}>
    <Text>
      Sign out
    </Text>
</TouchableOpacity>
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen:Home,
    navigationOptions:{
      tabBarLabel:'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-home" size={24} color={tintColor} />
    )
    }
  },
  Invest: {
    screen:Invest,
    navigationOptions:{
      tabBarLabel:'Invest',
      tabBarIcon: ({tintColor})=>(
          <Icon name="ios-search" size={24} color={tintColor} />
      )
      }
    },
    Portfolio: {
      screen:myPortfolio,
      navigationOptions:{
        tabBarLabel:'Portfolio',
        tabBarIcon: ({tintColor})=>(
            <Icon name="ios-easel" size={24} color={tintColor} />
        )
      }},
  Account: {
    screen:Profile,
    navigationOptions:{
      tabBarLabel:'Account',
      tabBarIcon: ({tintColor})=>(
          <Icon name="ios-contact" size={24} color={tintColor} />
      )
      }}
},{
  tabBarOptions:{
    showLabel: false,
    activeTintColor: '#0EBE2C',
    inactiveTintColor:'lightgray',
    style: {
      backgroundColor:'white',
      borderTopWidth:0,
      shadowOffset:{width:5,height:3},
      shadowColor:'black',
      shadowOpacity: 0.5,
      elevation: 5
    }
  }
});

export default createAppContainer(TabNavigator);
