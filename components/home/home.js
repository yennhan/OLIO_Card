import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Alert,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  Button,
  FlatList,
  Image,
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';
import * as shape from 'd3-shape'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AnimatedBar from '../animation/animate';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons'
import { LineChart, AreaChart, BarChart, Grid } from 'react-native-svg-charts'
import { ButtonGroup } from 'react-native-elements'
import { LinearGradient, Stop, Defs, Line } from 'react-native-svg'
import { Text as SvgText, Rect, G, Circle } from 'react-native-svg'
import { Block } from './block'
import { Category } from './Category'
import moreInfo from '../moreInfo/moreInfo'
import MyWeb from '../moreInfo/webView'
import Reload from '../reload/reload'
import Purchase from '../executePurchase/purchase'
Amplify.configure({ Auth: awsConfig });

const { height, width } = Dimensions.get('window')

const window = Dimensions.get('window');
const styles = require('./homeStyles');
// Fetch the token from storage then navigate to our appropriate place
const DELAY = 80;
class Home extends Component {
  //_isMounted = false;
  state = {
    userToken: '',
    isLoading: true,
    error: null,
    refreshing: false,
    userToken: null,
    info: {},
    attributes: {},
    data: [1, 2, 3],
    theETF: [],
    theHoldings: [],
    selectedIndex: 0,
    mockPortfolio: [20, 10, 30, 95, -4, -24, 85, -30, 23, 45, 88, 32, 120, 91, 35, 53, -53, 24, 50, -20, 150],
    notificationText: 'Loading',
    accountBalance: 'Loading',
    portfolioValue: '10,240',
    portfolioChange: '101',
    percentageChange: '0.68',

  }
  updateIndex = (selectedIndex) => {
    this.generatePortfolioMock()
    this.setState({ selectedIndex })
  }
  generateData = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push((Math.floor(Math.random() * 50)));
    }
    this.setState({
      data
    });
    return data
  }
  generatePortfolioMock = () => {
    const mockPortfolio = [];
    for (let i = 0; i < 15; i++) {
      mockPortfolio.push((Math.floor(Math.random() * 100)));
    }
    this.setState({
      mockPortfolio
    });
    return mockPortfolio
  }
  generatePortfolioValue = () => {
    const pValue = ['10,389', '10,521', '10,800'];
    const iValue = ['5.5', '132', '279'];
    const cValue = ['5.5', '7.4', '11.56'];
    let i = pValue.length
    const j = Math.floor(Math.random() * i);
    this.setState({
      portfolioValue: pValue[j],
      portfolioChange: iValue[j],
      percentageChange: cValue[j]
    })
    return pValue, iValue, cValue
  }
  generateNotifications = () => {
    const notified = ['Pending execution of sales for A.I tech at USD 28.00', 'You placed an order for Big Banks. Your order will be executed once market is open at USD 23.97', 'Order for PropertyRush has been executed at USD 85.88 . View it in your portfolio now!'];
    let i = notified.length
    const j = Math.floor(Math.random() * i);
    this.setState({
      notificationText: notified[j]
    })
    return notified
  }
  componentWillMount() {
    this.startHeaderHeight = 60
    if (Platform.OS == 'android') {
      this.startHeaderHeight = 60 + StatusBar.currentHeight
    }
  }
  renderUserPortfolio() {
    const data = [20, 10, 30, 95, -4, -24, 85, -30, 23, 45, 88, 32, 120, 91, 35, 53, -53, 24, 50, -20, 150]
    /**
     * Both below functions should preferably be their own React Components
     */
    const HorizontalLine = (({ y }) => (
      <Line
        key={'zero-axis'}
        x1={'0%'}
        x2={'100%'}
        y1={this.state.mockPortfolio[5]}
        y2={this.state.mockPortfolio[5]}
        stroke={'grey'}
        strokeDasharray={[6, 8]}
        strokeWidth={1.5}
      />
    ))

    const Tooltip = ({ x, y }) => (
      <G
        x={x(5) - (75 / 2)}
        key={'tooltip'}
        onPress={() => console.log('tooltip clicked')}
      >
        <G y={50}>
          <Rect
            height={40}
            width={75}
            stroke={'grey'}
            fill={'white'}
            ry={10}
            rx={10}
          />
          <SvgText
            x={75 / 2}
            dy={20}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
            stroke={'rgb(134, 65, 244)'}
          >
            {`${data[5]}ºC`}
          </SvgText>
        </G>
        <G x={75 / 2}>
          <Line
            y1={50 + 40}
            y2={y(data[5])}
            stroke={'grey'}
            strokeWidth={2}
          />
          <Circle
            cy={y(data[5])}
            r={6}
            stroke={'rgb(134, 65, 244)'}
            strokeWidth={2}
            fill={'white'}
          />
        </G>
      </G>
    )
    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
          <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
          <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
        </LinearGradient>
      </Defs>
    )
    return (
      <LineChart
        style={{ padding: 20, height: 200 }}
        data={this.state.mockPortfolio}
        svg={{
          stroke: '#0EBE2C',
          strokeWidth: 3,
        }}
        contentInset={{ top: 10, bottom: 10, right: 10 }}
        //curve={shape.curveNatural}
        curve={shape.curveLinear}
      >
        <Gradient />
        <HorizontalLine />
      </LineChart>
    )
  }
  renderETF = ({ item }) => {
    return (
      <TouchableOpacity key={item.symbol} onPress={() => { this.props.navigation.push('Detail', { theItem: item, etfHoldings: this.theHoldings }) }} style={[styles.home_shadow, { borderRadius: 12, marginLeft: 25, height: 230, width: 330, borderColor: '#dddddd' }]}>
        <View >
          <ImageBackground source={{ uri: item.image }} imageStyle={{ borderRadius: 12 }} style={[{ width: 330, height: 230, resizeMode: 'cover' }]}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, width: 330, height: 230 }}>
              <Image style={[styles.home_avatar, { margin: 20 }]} source={{ uri: item.companyIcon }} />
              <View style={{ margin: 20, paddingLeft: 50, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{item.companyName}</Text>
              </View>
              <View style={{ left: 10, bottom: 5, width: 330, position: 'absolute' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{item.title}</Text>
                <Text style={{ fontSize: 12, fontWeight: '300', color: 'white' }}>{item.description}</Text>
                <Text style={{ paddingRight: 20, fontSize: 16, fontWeight: 'bold', color: 'white', alignSelf: 'flex-end' }}>USD {item.latestPrice} ({item.change}%)</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    )

  }
  getETFs = () => {
    const url = 'https://api.thecashguard.com/products/getETF'
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          theETF: responseJSON,
          theHoldings: responseJSON[0].holdings[0],
          isLoading: false,
        })
        //console.log(responseJSON[0].holdings[0].data)
      })
      .catch((error) => {
        console.log(error)
        //Alert.alert(error.toString())

      })
  }
  async componentDidMount() {
    await this.loadApp()
    //this._isMounted = true;
    this.generateData()

    this.getETFs()
    this.getCompany
    //this.generateNotifications()
    //this.interval = setInterval(() => this.generatePortfolioMock(),4000);
    this.interval = setInterval(() => this.generatePortfolioValue(), 4000);
    this.interval = setInterval(() => this.generateNotifications(), 2000);
    //this.interval = setInterval(() => this.generateData(), 3000);
    const info = await Auth.currentUserInfo()
    //console.log('Returned info: ', info.attributes)
    const attributes = info.attributes
    this.setState({ attributes })
    this.setState({ info })
    this.getDatabaseUser()
  }
  componentWillUnmount() {
    //this._isMounted = false;
    clearInterval(this.interval);
  }
  // Get the logged in users and remember them
  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ userToken: user.signInUserSession.accessToken.jwtToken })
      })
      .catch(err => console.log(err))
    this.postUser()
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
  }
  handlerButtonOnClick = () => {
    this.setState({
      pressStatus: true
    });
  }
  postUser = () => {
    var { userToken } = this.state
    const url = 'https://api.thecashguard.com/account/' + userToken
    fetch(url, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        responseJSON.map((item, index) => {
          //console.log(responseJSON)
        })
      })
      .catch((error) => {
        console.log(error)

      })
  }
  getCOMPANY = () => {
    const url = 'https://api.thecashguard.com/products/getCompany'
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({ loading: !this.state.loading });
        responseJSON.map((item, index) => {
          var allInfo = {};
          var symbol = item['symbol'];
          var name = item['companyName']
          let theID = { symbol: responseJSON };
          //allCompanyInfo[symbol] = responseJSON;
          this.setState({ [symbol]: name })
        })
      })
      .catch((error) => {
        console.log(error)

      })
  }
  getDatabaseUser() {
    const { info } = this.state
    var { username } = info

    const url = 'https://api.thecashguard.com/account/Details/' + username
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({ accountBalance: responseJSON['account_balance'] })
      })
      .catch((error) => {
        console.log(error)

      })
  }
  onReload = () => {
    this.props.navigation.navigate('reloading', { callHome: this.getDatabaseUser.bind(this) })
  }
  render() {
    const { info } = this.state
    const { attributes } = this.state
    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
          <Stop offset={'0%'} stopColor={'#93F9B9'} />
          <Stop offset={'100%'} stopColor={'#1D976C'} />
        </LinearGradient>
      </Defs>
    )
    const { theETF } = this.state
    const CUT_OFF = 15
    const Labels = ({ x, y, bandwidth, data }) => (
      data.map((value, index) => (
        <G
          key={index}>
          <SvgText
            x={x(index) + (bandwidth / 2)}
            y={y(value) - 7}
            fontSize={11}
            fontWeight={'bold'}
            fill={'#000000'}
            animate={true}
            animationDuration={500}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
          >
            {'$' + value}
          </SvgText>
          <Rect
            x={x(index)}
            y={y(value) - 2} // Subtract Height / 2 to make half of the Rect above the bar
            rx={5} // Set to Height / 2
            ry={5} // Set to Height / 2
            width={bandwidth}
            height={5} // Height of the Rect
            fill={'#FFFFFF'}
          />
        </G>
      ))
    )
    const component1 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1D</Text>
    const component2 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1W</Text>
    const component3 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1M</Text>
    const component4 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>6M</Text>
    const component5 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1Y</Text>
    const component6 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>ALL</Text>
    const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }, { element: component4 }, { element: component5 }, { element: component6 }]
    return (
      // this.state.isLoading ?
      //       <View style = {{justifyContent:'center'}}>
      //         <ActivityIndicator color="green" animating />
      //       </View>
      //       :
      <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }} >
        <View style={{ alignContent: 'flex-start', flexDirection: 'row' }}>
          <Text style={{ color: 'black', width: '80%', marginTop: 5, marginLeft: 10, fontWeight: "bold", fontSize: 30 }}>Home</Text>
          <View style={{ margin: 15 }}>
            <FontAwesome containerStyle={{ alignSelf: 'flex-end', right: 0 }} name="ellipsis-h" size={30 * 0.75} color='black' />
          </View>
        </View>
        <View
          style={{
            borderBottomColor: 'lightgray',
            borderBottomWidth: 0.5,
          }}
        />
        <ScrollView
          scrollEventThrottle={16} contentContainerStyle={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}>
          <View style={[styles.home_shadow, { backgroundColor: 'whitesmoke', height: 200, margin: 15, paddingLeft: 5, paddingRight: 5, borderRadius: 6, borderWidth: 0.5, overflow: 'visible', borderColor: '#dddddd' }]}>

            <View style={{ flexDirection: 'row-reverse' }}><Text style={{ color: 'gray', marginRight: 20, fontSize: 30, marginTop: 20 }}>OLIO</Text></View>
            <Text style={{ position: 'absolute', bottom: 30, left: 15, color: 'gray' }}>WASP VENTURE SDN BHD</Text>
            <Image
              style={{ width: 70, position: 'absolute', bottom: 0, right: 0, marginRight: 20, height: 70, resizeMode: 'contain' }}
              source={{ uri: 'https://s3-ap-southeast-1.amazonaws.com/wasp-images/mastercard.png' }}
            />
          </View>
          {/* <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 15 }}>
            <TouchableOpacity onPress={this.onReload} style={[{ marginTop: 10, width: '50%', height: 30, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'black', borderRadius: 5 }]}>
              <Text style={{ fontWeight: '500', color: 'white', fontSize: 14, textAlign: 'center', padding: 5 }}>Pay </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{ marginTop: 10, width: '50%', height: 30, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'black', borderRadius: 5 }]}>
              <Text style={{ fontWeight: '500', color: 'white', fontSize: 14, textAlign: 'center', padding: 5 }}>Scan </Text>
            </TouchableOpacity>
          </View> */}
          {/* <View style={[styles.home_shadow,{height:80,margin:15,paddingleft:10,paddingRight:10,borderWidth:0.5,borderRadius:6,backgroundColor:'white',overflow:'visible',borderColor:'#dddddd'}]}>
          <View style={{flexDirection:'row'}}>
          <Text style={{ color: 'black', marginTop: 10, marginLeft: '3%', fontWeight: "bold", fontSize: 14 }}>Notification</Text>
          <TouchableOpacity style={{marginLeft: "55%"}}>
          <Text style={{ color: '#0EBE2C',marginTop:10,  fontWeight: "500", fontSize: 14 }}>View All</Text>
          </TouchableOpacity>
          </View>
          <Text style={{ color: 'black', marginTop: 5, marginLeft: 15, fontWeight: "300", fontSize: 13 }}>{this.state.notificationText}</Text>
          </View> */}
          <View style={{ flexDirection: 'row', height: 190, marginTop: 0, paddingLeft: 10, paddingRight: 5 }}>
            <View style={{ flexDirection: 'column', height: '100%', width: '50%' }}>
              <View style={[{ elevation: 2, flex: 2, backgroundColor: 'white', overflow: 'visible', marginLeft: 10, marginTop: 10, borderRadius: 4, borderColor: '#dddddd', borderWidth: 0.5, height: '50%', width: '95%' }, styles.home_shadow]}>
                <Text style={{ marginTop: 10, marginLeft: 10, fontWeight: "bold", fontSize: 14 }}>Credit Balance</Text>
                <Text style={{ color: 'black', marginTop: 5, marginLeft: 10, fontWeight: "500", fontSize: 22 }}>$ {this.state.accountBalance}</Text>
                <Text style={{ marginTop: 5, color: 'gray', marginLeft: 10, fontWeight: "400", fontSize: 16 }}>$ 97,700 spend</Text>
                <View style={{ flexDirection:'row',marginTop: 30, marginLeft: 10,alignItems:'space-around' }}>
                  <View style={{paddingRight:10}}>
                  <TouchableOpacity onPress={this.onReload} style={[{ justifyContent: 'center', borderRadius: 400, width: 60, height: 60, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'black'}]}>
                    <Text style={{ fontWeight: '500', color: 'white', fontSize: 16, textAlign: 'center', padding: 5 }}>PAY</Text>
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={this.onReload} style={[{ justifyContent: 'center', borderRadius: 400, width: 60, height: 60, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'black' }]}>
                    <Text style={{ fontWeight: '500', color: 'white', fontSize: 16, textAlign: 'center', padding: 5 }}>SCAN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[{ elevation: 2, alignItems: 'center', flex: 2, backgroundColor: 'white', overflow: 'visible', marginLeft: 5, marginRight: 10, marginTop: 10, borderRadius: 4, borderColor: '#dddddd', borderWidth: 0.5, height: 180, width: '50%' }, styles.home_shadow]}>
              {/* <Text style={{ marginTop: 10, fontWeight: "300", fontSize: 14 }}>Investment Goal</Text>
              <Text style={{ color: 'black', fontWeight: "bold", fontSize: 22 }}>$ 1,234.55</Text>
              <Text style={{ color: 'gray', fontWeight: "400", fontSize: 14 }}>$ 10,992.45 invested</Text> */}
              <View style={{ paddingTop: 5, alignItems: 'center' }}>
                <AnimatedCircularProgress
                  size={120}
                  width={6}
                  fill={90}
                  tintColor='red'
                  duration={800}
                  rotation={0}
                  // onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="lightgray"
                >
                  {
                    (fill) => (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black', marginTop: 10, fontWeight: "bold", fontSize: 14 }}> Limit</Text>
                        <Text style={{ color: 'black', fontWeight: "500", fontSize: 14 }}>$ 100,000,00</Text>
                        <Text style={{ color: 'gray', fontWeight: "400", fontSize: 10 }}></Text>
                      </View>
                    )
                  }</AnimatedCircularProgress>
                <View style={{ flexDirection: 'row', paddingLeft: 15,paddingRight:15 }}>
                  <TouchableOpacity style={[{ marginTop: 10, width: '100%', height: 30, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'black', borderRadius: 5 }]}>
                    <Text style={{ fontWeight: '500', color: 'white', fontSize: 14, textAlign: 'center', padding: 5 }}>Increase Limit </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={{ alignContent: 'flex-start', flexDirection: 'row' }}>
            <Text style={{ color: 'black', width: '72%', marginTop: 20, marginLeft: 20, fontWeight: "bold", fontSize: 22 }}>
              Transactions
        </Text>
            <TouchableOpacity style={{ paddingRight: 20, marginTop: 25 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

}
const DetailStack = createStackNavigator(
  {
    routeOne: Home,
    Detail: moreInfo,
    toWeb: MyWeb,
    reloading: Reload,
    Order: Purchase


  }, {
    initialRouteName: 'routeOne',
    headerMode: 'none'
  }
);
const App = createAppContainer(DetailStack);
export default createAppContainer(App);
{/* <View style={{flexDirection:"row-reverse",justifyContent: 'center'}}>
        <View style={{flexDirection:"row-reverse",justifyContent: 'center',justifyContent:'space-around',width:170,height:50}}>
          {this.state.data.map((value, index) => <AnimatedBar value={value} delay={DELAY * index} key={index} />)}
        </View> 
      </View> */}
{/* <View style={{ margin: 10, color: 'white', borderRadius: 10, height: 100, borderColor: '#dddddd', borderWidth: 0.5 }}>
            <BarChart
            style={{ height: 150 }}
            data={this.state.data}
            animate={true}
            animationDuration={500}
            formatLabel={ (value, index) => index }
            gridMin={0}
            spacingInner={0.4}
            contentInset={{ top: 20, bottom: 0 }}
            svg={{
              strokeWidth: 2,
              fill: '#58D68D',
            }}
          >
            <Labels />
          </BarChart>
          </View> */}