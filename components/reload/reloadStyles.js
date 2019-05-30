const React = require('react-native');
const { Dimensions, StyleSheet } = React;

module.exports = StyleSheet.create({
  fullSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  reload_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reload_form_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reload_actions_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  reload_input: {
    width: 350,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 0,
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 14
  },
  reload_button: {
    backgroundColor: '#000',
    width: Dimensions.get('window').width,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reload_button_text: {
    color: 'mediumseagreen',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reload_button: {
    backgroundColor: 'white',
    color: "black",
    width: 200,
    margin: 10,
    height: 30,
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  reload_banner_text: {
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