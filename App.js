import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createSwitchNavigator,createAppContainer } from 'react-navigation';
import tabs from './components/tabs/tabs';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import Confirmation from './components/Confirmation/Confirmation';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import moreinfo from './components/moreInfo/moreInfo';


const MainNavigator = createSwitchNavigator({
  Signin: { screen: Signin },
  Signup: { screen: Signup },
  Profile: { screen: Profile },
  Confirmation: { screen: Confirmation },
  ForgotPassword: { screen: ForgotPassword },
  tabs: {screen: tabs},
  //detailsETF: {screen: moreinfo},
  initialRouteName: 'Login',
});


class App extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <MainNavigator/>
      </View>
    )
  }
};
export default createAppContainer(MainNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});