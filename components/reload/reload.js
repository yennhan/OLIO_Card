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
    TextInput
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

const styles = require('./reloadStyles');
export default class Reload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userToken: '',
            info: {},
            attributes: {},
            amount: '',
            cardnumber: '',
            cardname: '',
            cardExpiry: '',
            cardCVV: '',
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
    }
    componentWillUnmount() {
        const {params} = this.props.navigation.state;
        //console.warn(params)
        params.callHome();
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
    reloadUser = () => {
        const { info } = this.state
        var {username} = info
        var { amount } = this.state
        const url = 'https://api.thecashguard.com/account/' + username + '/' + amount
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
    render() {
        const { info } = this.state
        const { attributes } = this.state
        var { userToken } = this.state
        return (
            <SafeAreaView>
                <View style={{ alignContent: 'flex-start', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }}>
                        <Text style={{ color: 'black', width: '80%', marginTop: 5, marginLeft: 10, fontWeight: "bold", fontSize: 25 }}>X</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        borderBottomColor: 'lightgray',
                        borderBottomWidth: 0.5,
                    }}
                />
                <KeyboardAvoidingView style={styles.fullSize} behavior="padding" enabled>
                    <View style={[{ flex: 1, paddingLeft: 0, width: '100%', height: 1100, margin: 0, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
                        <Text style={{ paddingLeft: 20, paddingTop: 20, fontWeight: 'bold', fontSize: 25 }}>Top Up</Text>
                        <TextInput
                            style={[styles.reload_input, { width: '85%', marginLeft: 20 }]}
                            onChangeText={(amount) => this.setState({ amount })}
                            value={this.state.amount}
                            keyboardType='numeric'
                            placeholder="RM100 e.g"
                            onFocus={() => this.setState({ amount: '' })}
                            underlineColorAndroid="#fff"
                            returnKeyType='done'
                            clearButtonMode="while-editing"
                        />
                        <Text style={{ paddingLeft: 20, paddingTop: 20, fontWeight: 'bold', fontSize: 20 }}>Card</Text>
                        <Text style={{ paddingLeft: 20, paddingTop: 10, fontWeight: '500', fontSize: 15 }}>Card Number</Text>
                        <TextInput
                            style={[styles.reload_input, { width: '85%', marginLeft: 20 }]}
                            onChangeText={(cardnumber) => this.setState({ cardnumber })}
                            value={this.state.cardnumber}
                            keyboardType='numeric'
                            placeholder="Card number"
                            onFocus={() => this.setState({ cardnumber: '' })}
                            underlineColorAndroid="#fff"
                            returnKeyType='done'
                            clearButtonMode="while-editing"
                        />
                        <View style={{ flexDirection: 'row', height: 50 }}>
                            <Text style={{ paddingLeft: 20, paddingTop: 10, width: '40%', fontWeight: '500', fontSize: 15 }}>Valid Till</Text>
                            <Text style={{ paddingLeft: 20, marginLeft: 20, paddingTop: 10, width: '40%', fontWeight: '500', fontSize: 15 }}>CVV/CID</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style={[styles.reload_input, { width: '40%', marginLeft: 20 }]}
                                onChangeText={(cardExpiry) => this.setState({ cardExpiry })}
                                placeholder='MM/YY'
                                keyboardType={'numeric'}
                                value={this.state.cardExpiry}
                                onFocus={() => this.setState({ cardExpiry: '' })}
                                underlineColorAndroid="#fff"
                                returnKeyType='done'
                                clearButtonMode="while-editing"
                            />
                            <TextInput
                                style={[styles.reload_input, { width: '40%', marginLeft: 20 }]}
                                onChangeText={(cardCVV) => this.setState({ cardCVV })}
                                placeholder='CVV/CID'
                                keyboardType={'numeric'}
                                value={this.state.cardCVV}
                                onFocus={() => this.setState({ cardCVV: '' })}
                                underlineColorAndroid="#fff"
                                returnKeyType='done'
                                clearButtonMode="while-editing"
                            />
                        </View>
                        <TouchableOpacity onPress={this.completeItem} style={[styles.home_shadow, { paddingLeft: 5, paddingRight: 10, alignSelf: 'center', alignContent: 'center', width: '90%', height: 35, borderWidth: 1.0, borderColor: 'white', backgroundColor: 'mediumseagreen', borderRadius: 4 }]}>
                            <Text style={{ fontWeight: '600', color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>Reload</Text>
                        </TouchableOpacity>
                        <View style={{ height: 150, width: 150, alignContent: 'center', alignSelf: 'center' }}>
                            <LottieView source={require('./thesuccess.json')} progress={this.state.progress} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
