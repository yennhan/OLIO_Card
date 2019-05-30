const React = require('react-native');
const { Dimensions, StyleSheet } = React;
import * as theme from './secondStyles'
module.exports = StyleSheet.create({
  fullSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  home_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  home_form_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  home_actions_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  home_input: {
    width: 280,
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'left',
    fontSize: 14
  },
  home_button: {
    backgroundColor: '#000',
    width: Dimensions.get('window').width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  home_button_text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 10
  },
  home_button: {
    backgroundColor: '#fff',
    color: "lightgrey",
    width: 200,
    margin: 10,
    height: 30,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  home_banner_text: {
    width: Dimensions.get('window').width,
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'left'
  },
  home_card:{
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.shadow,
    borderWidth: 1
  },
  home_shadow: {
    shadowColor: 'black',
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.1,
    shadowRadius:2,
     // its for android 
     elevation: 5,
     position:'relative',
  },
  home_dots: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  home_activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: 'green',
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 36,
    right: 0,
    left: 0
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  home_avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.sizes.padding / 2,
  },
  home_description: {
    fontSize: theme.sizes.font * 1.2,
    lineHeight: theme.sizes.font * 2,
    color: theme.colors.caption
  },
  home_pressPortfolio: {

  },
  home_noPress: {

  },
  button: {
    alignSelf:'center',
    borderColor: '#000066',
    backgroundColor: '#000066',
    width:65,
    height:65
  },
  buttonPress: {
    alignSelf:'center',
    borderColor: '#000066',
    backgroundColor: '#000066',
    width:75,
    height:75
  },
});