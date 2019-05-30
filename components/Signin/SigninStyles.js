const React = require('react-native');
const { Dimensions, StyleSheet } = React;

module.exports = StyleSheet.create({
  fullSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  signin_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signin_form_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signin_actions_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  signin_input: {
    width: 280,
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'left',
    fontSize: 14
  },
  signin_button: {
    backgroundColor: '#000',
    width: Dimensions.get('window').width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signin_button_text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 10
  },
  signup_button: {
    backgroundColor: '#fff',
    color: "lightgrey",
    width: 200,
    margin: 10,
    height: 30,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  signin_banner_text: {
    width: Dimensions.get('window').width,
    height: 50,
    marginTop: 100,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 10,
    textAlign: 'center'
  },
});