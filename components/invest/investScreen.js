import React, { Component } from 'react';
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
import { TagSelect } from 'react-native-tag-select';
import moreinfo from '../moreInfo/moreInfo';
import MyWeb from '../moreInfo/webView'
import Purchase from '../executePurchase/purchase'
Amplify.configure({ Auth: awsConfig });

const { height, width } = Dimensions.get('window')

const window = Dimensions.get('window');
const styles = require('./investStyle');
// Fetch the token from storage then navigate to our appropriate place

class Invest extends Component {
    //_isMounted = false;
    state = {
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

    }
    componentWillMount() {
        this.startHeaderHeight = 60
        if (Platform.OS == 'android') {
            this.startHeaderHeight = 60 + StatusBar.currentHeight
        }
    }
    renderETF = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { this.props.navigation.push('Detail', { theItem: item, etfHoldings: this.theHoldings }) }} key={item.symbol} style={[{ alignItems: "center", borderRadius: 12, marginTop: 20, height: 180 }]}>
                <View >
                    <ImageBackground source={{ uri: item.image }} imageStyle={{ borderRadius: 12 }} style={[{ width: 330, height: 180, resizeMode: 'cover' }]}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, width: 330, height: 180 }}>
                            <Image style={[styles.home_avatar, { margin: 20 }]} source={{ uri: item.companyIcon }} />
                            <View style={{ margin: 20, paddingLeft: 50, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{item.companyName}</Text>
                            </View>
                            <View style={{ left: 10, bottom: 5, width: 330, position: 'absolute' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{item.title}</Text>
                                <Text style={{ fontSize: 12, fontWeight: '300', color: 'white' }}>{item.description}</Text>
                                <Text style={{ paddingRight: 20, fontSize: 16, fontWeight: 'bold', color: 'white', alignSelf: 'flex-end' }}>USD {item.latestPrice} ({item.change}%)</Text>
                            </View>
                            {/* <TouchableOpacity style={{ borderRadius: 12, bottom: -100, backgroundColor: 'white', width: 320, height: 50 }}>
                </TouchableOpacity> */}
                            {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('detailsETF') }} style={[styles.home_shadow, { right: 30, left: 30, bottom: -80, overflow: 'visible', width: '80%', height: 100, borderRadius: 6, backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                <Text style={{ color: 'black', paddingTop: 10, paddingBottom: 2, paddingLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{item.title}</Text>
                <Text style={[{ height: 40, color: 'gray', paddingTop: 5, paddingLeft: 10, paddingRight: 8, fontWeight: '200', fontSize: 10 }]}>{item.description}</Text>
                <Text style={{ paddingBottom: 20, paddingTop: 10, marginRight: 5, color: 'black', fontWeight: '600', fontSize: 14, alignSelf: 'flex-end' }}>USD {item.latestPrice} <FontAwesome containerStyle={{ alignSelf: 'right' }} name="chevron-right" size={16 * 0.75} color='black' /></Text>
              </TouchableOpacity> */}
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
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({
                    theETF: responseJSON,
                    theHoldings: responseJSON[0].holdings[0],
                    isLoading: false,
                })
                
            })
            .catch((error) => {
                console.log(error)

            })
    }
    async componentDidMount() {
        await this.loadApp()
        //this._isMounted = true;
        this.getETFs()
        //this.interval = setInterval(() => this.generateData(), 3000);
        const info = await Auth.currentUserInfo()
        //console.log('Returned info: ', info.attributes)
        const attributes = info.attributes
        this.setState({ attributes })
        this.setState({ info })
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        //this._isMounted = false;
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
    render() {
        const { info } = this.state
        const { attributes } = this.state
        const { name } = attributes
        const CUT_OFF = 15
        const tagdata = [
            { id: 1, label: 'Technology' },
            { id: 2, label: 'Banks' },
            { id: 3, label: 'Energy' },
            { id: 4, label: '10 Most Popular' },
            { id: 5, label: 'Healthcare' },
        ];
        return (
            // this.state.isLoading ?
            //       <View style = {{justifyContent:'center'}}>
            //         <ActivityIndicator color="green" animating />
            //       </View>
            //       :
            <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }} >
                <View style={{ alignContent: 'flex-start', flexDirection: 'row' }}>
                    <Text style={{ color: 'black', width: '80%', marginTop: 5, marginLeft: 10, fontWeight: "bold", fontSize: 30 }}>Discover</Text>
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
                    <View style={{ height: 50, backgroundColor: 'white', paddingTop: 10 }}>
                        <View style={[styles.home_shadow, { alignItem: 'flex', flexDirection: 'row', backgroundColor: 'white', padding: 5, marginHorizontal: 20 }]}>
                            <Icon style={{ padding: 5, paddingTop: 5 }} name='ios-search' size={22} />
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder=' Search...'
                                placeholderTextColor='grey'
                                style={{ padding: 5, flex: 1, fontWeight: '700', backgroundColor: 'white' }}
                            />
                        </View>
                    </View>
                    <View style={{ height: '100%', marginTop: 10 }}>
                        <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontWeight: '600', color: 'black', fontSize: 18, marginTop: 10, paddingBottom: 10 }}>Popular ETFs</Text>
                            <TagSelect
                                data={tagdata}
                                max={4}
                                itemStyle={styles.tag_design}
                                itemLabelStyle={styles.tag_label}
                                itemStyleSelected={{ backgroundColor: '#0EBE2C', borderWidth: 0 }}
                                itemLabelStyleSelected={styles.tag_selected}
                                ref={(tag) => {
                                    this.tag = tag;
                                }}
                                onMaxError={() => {
                                    Alert.alert('Ops', 'Max reached');
                                }}
                            />
                        </View>
                        <FlatList
                            data={this.state.theETF}
                            renderItem={this.renderETF}
                            //extraData={this.state.theETF}
                            keyExtractor={(item, index) => index.toString()}
                            snapToAlignment={'center'}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={Dimensions.get('window').width / 10}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>

        );
    }
}
const DetailStack = createStackNavigator(
    {
        routeOne: Invest,
        Detail: moreinfo,
        toWeb:MyWeb,
        Order:Purchase
    }, {
        initialRouteName: 'routeOne',
        headerMode: 'none'
    }

);
const App = createAppContainer(DetailStack);
export default createAppContainer(App);
