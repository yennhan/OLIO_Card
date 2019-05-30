const React = require('react-native');
const { Dimensions, StyleSheet } = React;
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
    backgroundColor: 'white',
    borderColor: 'gray',
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
    backgroundColor: '#DCE0E9',
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
    backgroundColor: '#DCE0E9',
  },
  home_avatar: {
    width: 40,
    height: 40,
    borderRadius: 36 / 2,
  },
  home_description: {
    fontSize: 14 * 1.2,
    lineHeight: 14 * 2,
    color: '#BCCCD4'
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
  tag_design: {
    backgroundColor:'white',
    borderColor:'#58D56D',
    borderWidth: 1.0
  },
  tag_label:{
    color:'black',
    fontSize: 14,
    fontWeight:'400'
  },
  tag_selected: {
    color:'white',
    fontSize: 14,
    fontWeight:'400'
  }
});