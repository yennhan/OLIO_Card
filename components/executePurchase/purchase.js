import React, { Component } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    TextInput,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollableTabView, DefaultTabBar, ScrollableTabBar } from '@valdio/react-native-scrollable-tabview';
import { BarChart, XAxis } from 'react-native-svg-charts'
import { Text as SvgText, Rect, Circle, G, Line } from 'react-native-svg'
import * as scale from 'd3-scale'
import { Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';

Amplify.configure({ Auth: awsConfig });
const styles = require('./purchaseStyle');
export default class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userToken: '',
            info: {},
            attributes: {},
            accountBalance: '',
            amount: '',
            progress: new Animated.Value(0)

        };
    }
    componentWillMount() {
        this.startHeaderHeight = 60
        if (Platform.OS == 'android') {
            this.startHeaderHeight = 60 + StatusBar.currentHeight
        }
    }
    async componentDidMount() {
        await this.loadApp()
        //this._isMounted = true;
        const info = await Auth.currentUserInfo()
        const attributes = info.attributes
        this.setState({ attributes })
        this.setState({ info })
        this.getDatabaseUser()
    }
    componentWillUnmount() {
        //const { params } = this.props.navigation.state;
        //console.warn(params)
        //params.callHome();
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
    completeItem = () => {
        if (this.state.amount != '') {
            this.reloadUser()

        }
    };
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
    makeOrder = () => {
        const { info } = this.state
        var { accountBalance } = this.state
        var { username } = info
        var { amount } = this.state
        const { symbol } = this.props.navigation.state.params.purchaseOrder
        if (amount <= accountBalance) {
            const url = 'https://api.thecashguard.com/products/order/' + username + '/' + symbol+'/'+amount
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then((response) => response.json())
                .then((responseJSON) => {
                    Animated.timing(this.state.progress, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.linear,
                    }).start(() => this.props.navigation.goBack(null));
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
    render() {
        const { title } = this.props.navigation.state.params.purchaseOrder
        const { symbol } = this.props.navigation.state.params.purchaseOrder
        var { companyName } = this.props.navigation.state.params.purchaseOrder
        var { companyIcon } = this.props.navigation.state.params.purchaseOrder
        const { attributes } = this.state
        var { userToken } = this.state
        return (
            <SafeAreaView>
                <View style={{ alignContent: 'flex-start', flexDirection: 'row', width: '100%' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }} style={{ width: '30%' }}>
                        <Text style={{ color: 'black', width: '80%', marginTop: 5, marginLeft: 10, fontWeight: "bold", fontSize: 25 }}>X</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '600', fontSize: 17 }}>Balance: {this.state.accountBalance} USD</Text>
                </View>
                <View
                    style={{
                        borderBottomColor: 'lightgray',
                        borderBottomWidth: 0.5,
                    }}
                />
                <KeyboardAvoidingView>
                    <View style={{ position: 'absolute', paddingTop: 10, height: 800, width: '100%' }}>
                        <View style={{ alignSelf: 'center', padding: 10, height: 180, width: 320, borderRadius: 0.5, borderColor: 'darkgray', borderWidth: 0.5 }}>
                            <Image style={[{ width: 50, height: 50, alignSelf: 'center', margin: 5 }]} source={{ uri: companyIcon }} />
                            <Text style={{ textAlign: 'center', padding: 5, fontWeight: '600', fontSize: 18 }}>ETF Name</Text>
                            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 18 }}>{companyName}</Text>
                            <Text style={{ textAlign: 'center', paddingTop: 5, fontWeight: '400', fontSize: 14 }}>Ticker: {symbol}</Text>
                        </View>
                        <Text style={{ marginLeft: 20, paddingTop: 30, textAlign: 'left', fontWeight: 'bold', fontSize: 22 }}>Purchase Amount</Text>
                        <TextInput
                            style={[styles.reload_input, { width: '85%', marginLeft: 20 }]}
                            onChangeText={(amount) => this.setState({ amount })}
                            value={this.state.amount}
                            keyboardType='numeric'
                            placeholder="100 USD e.g"
                            onFocus={() => this.setState({ amount: '' })}
                            underlineColorAndroid="#fff"
                            returnKeyType='done'
                            clearButtonMode="while-editing"
                        />
                        <Text style={{ marginLeft: 20, paddingTop: 0, paddingBottom: 5, textAlign: 'left', fontWeight: '300', fontSize: 12 }}>Purchase price may vary upon orders executed</Text>
                        <TouchableOpacity onPress={this.makeOrder} style={[styles.home_shadow, { paddingLeft: 5, paddingRight: 10, alignSelf: 'center', alignContent: 'center', width: '90%', height: 35, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'mediumseagreen', borderRadius: 4 }]}>
                            <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>Order</Text>
                        </TouchableOpacity>
                        <View style={{ height: 150, width: 150, alignContent: 'center', alignSelf: 'center' }}>
                            <LottieView source={require('../reload/thesuccess.json')} progress={this.state.progress} />
                        </View>
                    </View>
                </KeyboardAvoidingView>

            </SafeAreaView>
        );
    }
}
