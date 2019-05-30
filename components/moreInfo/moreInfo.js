import React, { Component } from 'react';
import { debounce } from 'lodash'
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
  Button,
  ImageBackground,
  View,
  ActivityIndicator
} from 'react-native';
import ContentLoader from 'react-native-easy-content-loader'
import * as shape from 'd3-shape'
import AnimatedBar from '../animation/animate';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons'
import { LineChart, BarChart, Grid } from 'react-native-svg-charts'
import { ButtonGroup, Slider } from 'react-native-elements'
import { LinearGradient, Stop, Defs, Line } from 'react-native-svg'
import { Text as SvgText, Rect, G, Circle, Svg } from 'react-native-svg'
import { ScrollableTabView, DefaultTabBar, ScrollableTabBar } from '@valdio/react-native-scrollable-tabview';
import moment from "moment";
Amplify.configure({ Auth: awsConfig });

const { height, width } = Dimensions.get('window')

const window = Dimensions.get('window');
const styles = require('./moreInfoStyle');
// Fetch the token from storage then navigate to our appropriate place
const DELAY = 80;
export default class moreInfo extends Component {
  state = {
    isLoading: true,
    loadingGraph: true,
    loading: true,
    error: null,
    refreshing: false,
    userToken: null,
    attributes: {},
    data: [1, 2, 3],
    theETF: [],
    portfolioValue: '10,240',
    selectedIndex: 0,
    portfolioChange: '101',
    percentageChange: '0.68',
    allCompanyInfo: [],
    companyNames: [],
    itemSymbol: '',
    itemHistoryPrice: [],
    allNews: [],
    value: 0,
    maxLength: 0,
    attributes: [],
    randomColor: [
        'blueviolet',
        'mediumseagreen',
        'orange',
        'salmon',
        'dodgerblue'
    ]
  }

  updateValue(value) {
    this.setState({ value })
  }
  updateIndex = (selectedIndex) => {
    if (selectedIndex === 0) {
      this.getHistoryPrice(this.state.itemSymbol, '1W')
    } else if (selectedIndex === 1) {
      //this.setState({ loadingGraph: !this.state.loading });
      this.getHistoryPrice(this.state.itemSymbol, '1M')
    } else if (selectedIndex === 2) {
      //this.setState({ loadingGraph: !this.state.loading });
      this.getHistoryPrice(this.state.itemSymbol, '3M')
    } else if (selectedIndex === 3) {
      //this.setState({ loadingGraph: !this.state.loading });
      this.getHistoryPrice(this.state.itemSymbol, '6M')
    } else if (selectedIndex === 4) {
      //this.setState({ loadingGraph: !this.state.loading });
      this.getHistoryPrice(this.state.itemSymbol, '1Y')
    } else if (selectedIndex === 5) {
      //this.setState({ loadingGraph: !this.state.loading });
      this.getHistoryPrice(this.state.itemSymbol, 'ALL')
    }
    this.setState({ selectedIndex })
  }
  getNews = () => {
    const url = 'https://api.thecashguard.com/products/news/' + this.state.itemSymbol
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        
        this.setState({ allNews: responseJSON });
      })
      .catch((error) => {
        console.log(error)

      })
  }
  getHistoryPrice = (symbol, duration) => {
    const url = 'https://api.thecashguard.com/products/history/' + symbol + '/' + duration
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        if (this.state.loading != true){
          this.setState({ loadingGraph: false });
        }
        this.setState({
          itemHistoryPrice: responseJSON,
          maxLength: responseJSON.length - 1
        });
      })
      .catch((error) => {
        console.log(error)

      })
  }
  componentWillMount() {
    this.startHeaderHeight = 60
    if (Platform.OS == 'android') {
      this.startHeaderHeight = 60 + StatusBar.currentHeight
    }
  }
  async componentDidMount() {
    await this.loadApp()
    this.debounceUpdate = debounce(this.updateValue, 0)
    this.getCOMPANY()
    this.getNews()
    //this.interval = setInterval(() => this.generateData(), 3000);
    const info = await Auth.currentUserInfo()
    //console.log('Returned info: ', info.attributes)
    const attributes = info.attributes
    this.setState({ attributes })
  }

  componentWillUnmount() {
    //clearInterval(this.interval);
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
        this.getHistoryPrice(this.state.itemSymbol, '1W')
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
  // Get the logged in users and remember them
  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ userToken: user.signInUserSession.accessToken.jwtToken })
      })
      .catch(err => console.log(err))
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
  }
  renderHolding() {
    return this.state.companyNames.data.map((item, index) => {
      var theName = this.state[item.holding]
      return (
        <ContentLoader active containerStyles={{ paddingLeft: 20, paddingRight: 20 }} loading={this.state.loading} tHeight={0} pRows={5} paragraphStyles={{ width: '100%' }} animationDuration={300}>
          <View key={item.holding + 'view'} style={{ flexDirection: 'row' }}>
            <Text key={item.holding} style={{ color: 'darkgray', marginTop: 5, paddingLeft: 20, width: "80%" }}>{theName}</Text>
            <Text key={item.weight} style={{ color: 'darkgray', marginTop: 5, paddingRight: 20, width: '20%' }}>{item.weight}</Text>
          </View>
        </ContentLoader>
      )
    })
  }
  renderNews = ({ item }) => {
    var {token} = '?token=sk_5ed09a83873f47efbce1c58375b9017c'
    const today = this.state.currentDate;
    var timestamp = moment(item.time)
    const nearest = moment(timestamp).fromNow();
    var myColor = this.state.randomColor[Math.floor(Math.random()*this.state.randomColor.length)];
    //console.log(item.image +'?token=sk_5ed09a83873f47efbce1c58375b9017c');
    return (
      <TouchableOpacity key={item.time} onPress={() => { this.props.navigation.push('toWeb',{theLink:item}) }} >
        <View style={[styles.home_shadow,{backgroundColor:'white', height: 150, width: '100%',borderBottomWidth:0.5, borderColor:'lightgray' }]}>
          <View style={{paddingLeft:15,margin:10,width:'90%'}}>
          <Text style={{paddingBottom:5, color: myColor, fontWeight: '500', fontSize: 11 }}>{item.source}</Text>
          <Text numberOfLines={2} style={{ color: 'black', fontWeight: '500', fontSize: 14 }}>{item.headline}</Text>
          <Text numberOfLines={3} style={{ paddingTop:5, color: 'lightgray', fontWeight: '400', fontSize: 11 }}>{item.summary}</Text>
          </View>
          <View style={{paddingLeft:30,flexDirection:'row', position: 'absolute', bottom:5}}>
            <FontAwesome name="tag" size={15} backgroundColor='white' color='black' />
            <Text style={{paddingLeft:10, color: 'black', fontWeight: '500', fontSize: 11 }}>{nearest}</Text>
          </View>
          {/* <FontAwesome containerStyle={{ alignSelf: 'flex-end', right: 0 }} name="ellipsis-h" size={25 * 0.75} color='black'/> */}
        </View>
      </TouchableOpacity>
    )
  }
  renderUserPortfolio() {
    const data = this.state.itemHistoryPrice
    /**
     * Both below functions should preferably be their own React Components
     */
    const HorizontalLine = (({ x, y }) => (
      <Svg height="400" width="100%">
        <G>
          <Line
            key={'line-axis'}
            x1={x([this.state.value])}
            x2={x([this.state.value])}
            y1={40}
            y2={'90%'}
            stroke={'grey'}
            strokeDasharray={[7, 8]}
            strokeWidth={0.5}
          />
          <Circle
            key={'zero'}
            cx={x(this.state.value)}
            cy={y(data[this.state.value].close)}
            r={5}
            stroke={'#0EBE2C'}
            fill={'white'}
          />
          <SvgText x={x([this.state.value])} y={20} fontWeight="bold" textAnchor="middle">{data[this.state.value].close}</SvgText>
          <SvgText x={x([this.state.value])} y={'95%'} textAnchor="middle">{data[this.state.value].date}</SvgText>
        </G>
      </Svg>
    ))
    return (
      <ContentLoader active containerStyles={{ paddingLeft: 20, paddingRight: 20 }} loading={this.state.loadingGraph} tHeight={0} pRows={4} paragraphStyles={{ width: '100%',height:60 }} animationDuration={200}>
        <LineChart
          style={{ padding: 5, height: 250, width: '100%' }}
          data={data}
          yAccessor={({ item }) => item.close}
          //xAccessor={({ item }) => item.date}
          svg={{
            stroke: '#0EBE2C',
            strokeWidth: 2,
          }}
          contentInset={{ left: 40, top: 40, bottom: 40, right: 50 }}
          //curve={shape.curveNatural}
          curve={shape.curveLinear}
        >
          <HorizontalLine />
        </LineChart>
      </ContentLoader>
    )
  }
  orderItem = () => {
    this.props.navigation.navigate('Order',{purchaseOrder: this.props.navigation.state.params.theItem }) 
  }
  render() {
    const component1 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1W</Text>
    const component2 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1M</Text>
    const component3 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>3M</Text>
    const component4 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>6M</Text>
    const component5 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1Y</Text>
    const component6 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>10Y</Text>
    const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }, { element: component4 }, { element: component5 }, { element: component6 }]

    var { title } = this.props.navigation.state.params.theItem
    var { symbol } = this.props.navigation.state.params.theItem
    var { image } = this.props.navigation.state.params.theItem
    var { latestPrice } = this.props.navigation.state.params.theItem
    var { avgTotalVolume } = this.props.navigation.state.params.theItem
    var { description } = this.props.navigation.state.params.theItem
    var { companyName } = this.props.navigation.state.params.theItem
    var { oney }        = this.props.navigation.state.params.theItem
    var { threey }      = this.props.navigation.state.params.theItem
    var { fivey }       = this.props.navigation.state.params.theItem
    var { teny }        = this.props.navigation.state.params.theItem
    var { inception }   = this.props.navigation.state.params.theItem
    this.state.companyNames = this.props.navigation.state.params.theItem.holdings[0]
    this.state.itemSymbol = symbol
    //var { data } = this.props.navigation.state.params.etfHoldings 
    
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={{ uri: image }} imageStyle={{ borderRadius: 4 }} style={[{ width: '100%', height: 200, resizeMode: 'cover' }]}>
          <View style={{ height: 150, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <TouchableOpacity style={{ top: (Platform.OS)==='ios' ? +30:0, marginLeft: 10, alignSelf: 'flex-start', height: 60 }} onPress={() => { this.props.navigation.goBack(null) }}>
              <Icon name="ios-arrow-round-back" size={50} color={'white'} />
            </TouchableOpacity>
            <View style={{ alignContent: 'center' ,marginTop: (Platform.OS) === 'ios' ? 0 : -30 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 30, fontWeight: '500' }}>{title}</Text>
            </View>
          </View>
        </ImageBackground>
        <SafeAreaView style={{ position: 'absolute', top: 100 }}>
          <ScrollableTabView tabBarActiveTextColor='black' tabBarUnderlineStyle={{ height: 1, backgroundColor: '#0EBE2C' }} style={{ borderWidth: 0, marginTop: 0, backgroundColor: 'rgba(0,0,0,0.01)', backgroundColor: '#fff' }}>
            <ScrollView style={{ height: 650, shadowColor: '#ccc'}} tabLabel="Overview" scrollEventThrottle={16} >
              <View style={[styles.home_shadow, { paddingLeft: 0, width: '100%', height: 1200, margin: 0, borderRadius: 6, borderWidth: 1.5, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
                <Text style={{ textAlign: 'center', color: 'black', fontSize: 16, marginTop: 5, fontWeight: '500' }}>{companyName}</Text>
                <Text style={{ textAlign: 'center', marginBottom: 5, paddingLeft: 20, marginTop: 5, paddingRight: 10, color: 'black', width: '100%', fontSize: 13, fontWeight: '500' }}>Ticker: {symbol}</Text>
                <Text style={{ textAlign: 'center', marginBottom: 5, paddingLeft: 20, marginTop: 5, paddingRight: 10, color: 'black', width: '100%', fontSize: 13, fontWeight: '300' }}>{description}</Text>
                <Text style={{ marginTop: 0, color: 'black', textAlign: 'center', width: '100%', fontSize: 26, fontWeight: '600' }}>$ {latestPrice}</Text>
                <Text style={{ marginTop: 5, color: '#0EBE2C', textAlign: 'center', width: '100%', fontSize: 14, fontWeight: 'bold' }}>+${this.state.portfolioChange} ({this.state.percentageChange}%) (Today)</Text>
                {this.renderUserPortfolio()}
                <Text style={{ textAlign: 'center', fontSize: 10, color: 'darkgray', fontWeight: '200' }}>Updated few seconds ago</Text>
                <View style={{ padding: 10, paddingLeft: 30, paddingRight: 40 }}>
                  {/* <Text>{this.state.value}</Text> */}
                  <Slider
                    trackStyle={{ height: 0.5 }}
                    thumbStyle={{ height: 10, width: 20 }}
                    animateTransitions={true}
                    minimumTrackTintColor='gray'
                    thumbTintColor='black'
                    minimumValue={this.state.startState}
                    maximumValue={this.state.maxLength}
                    step={1}
                    value={this.state.value}
                    onValueChange={
                      (value) => this.debounceUpdate(value)}
                  />
                </View>
               
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={buttons}
                    selectedTextStyle={{ color: 'black' }}
                    selectedButtonStyle={{ backgroundColor: 'white', borderBottomColor: '#0EBE2C', borderBottomWidth: 2.5 }}
                    innerBorderStyle={{ color: 'white' }}
                    containerStyle={{ paddingLeft: 10, paddingRight: 10, backgroundColor: 'white', borderColor: 'white', borderRadius: 0, borderWidth: 0, width: '95%', height: 40 }}
                  />
                </View>
                <View>
                <Text style={{ color:'black',fontSize:13, fontWeight:'600',paddingLeft:20,marginTop:10}}>Historical Performance (Annual Return)</Text>
                  <View style={{ borderRight:0.2,borderLeft:0.2,paddingLeft:10,paddingTop:10,paddingRight:20,flexDirection:'row'}}>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'darkgray',fontSize:12}}>1-y</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'darkgray',fontSize:12}}>3-y</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'darkgray',fontSize:12}}>5-y</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'darkgray',fontSize:12}}>10-y</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'darkgray',fontSize:12}}>Inception</Text>
                  </View>
                  <View style={{ borderRight:1.2,borderLeft:1.2,paddingLeft:10,paddingTop:10,paddingRight:20, flexDirection:'row'}}>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'black'}}>{oney}</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'black'}}>{threey}</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'black'}}>{fivey}</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'black'}}>{teny}</Text>
                    <Text style={{fontWeight: '500',width:'20%',padding:2,textAlign: 'center', color:'black'}}>{inception}</Text>
                  </View>
                  </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ paddingLeft: 20, marginTop: 20, paddingRight: 10, color: 'black', width: '60%', fontSize: 13, fontWeight: 'bold' }}>Top 10 Holdings</Text>
                  <Text style={{ marginTop: 20, paddingLeft: 80, color: 'black', width: '40%', fontSize: 13, fontWeight: 'bold' }}> of Total</Text>
                </View>
                {this.renderHolding()}
              </View>
            </ScrollView>
            <ScrollView style={{ height: 600, shadowColor: '#ccc' }} tabLabel="NEWS">
            <Text style={{ color: 'black',marginTop:10, paddingLeft:15, fontWeight: "bold", fontSize: 14 }}>Today's News</Text>
              <FlatList
                inverted
                data={this.state.allNews}
                renderItem={this.renderNews}
                //extraData={this.state.theETF}
                keyExtractor={(item, index) => item.time.toString()}
                snapToAlignment={'center'}
                snapToInterval={Dimensions.get('window').width / 10}
              />
            </ScrollView>
          </ScrollableTabView>
        </SafeAreaView>
        <View style={{ flex: 2, position: 'absolute', justifyContent: 'flex-end', bottom: -10, width: '100%', justifyContent: 'flex-end', padding: 20 }}>
          <TouchableOpacity onPress={this.orderItem} style={[styles.home_shadow, { alignSelf: 'flex-end', alignContent: 'center', width: '100%', height: 35, borderWidth: 1.0, borderColor: 'white', backgroundColor: '#0EBE2C', borderRadius: 10 }]}>
            <Text style={{ fontWeight: '500', color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>BUY </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}