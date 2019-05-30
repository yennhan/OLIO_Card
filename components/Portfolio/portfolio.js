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
    FlatList,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollableTabView, DefaultTabBar, ScrollableTabBar } from '@valdio/react-native-scrollable-tabview';
import { BarChart, XAxis } from 'react-native-svg-charts'
import { Text as SvgText, Rect, Circle, G, Line } from 'react-native-svg'
import * as scale from 'd3-scale'
import moment from "moment";
Amplify.configure({ Auth: awsConfig });

export default class myPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            attributes: {},
            historicalReload: [],
            currentHolding: []
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
        //console.log('Returned info: ', info.attributes)
        const attributes = info.attributes
        this.setState({ attributes })
        this.setState({ info })
        this.getReloadTransactions()
        this.getMyTransactions()
    }
    componentWillUnmount() {
        //this._isMounted = false;
        //clearInterval(this.interval);
    }
    getMyTransactions = () => {
        const { info } = this.state
        var { username } = info
        const url = 'https://api.thecashguard.com/products/getUserTransaction/' + username
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
                    currentHolding: responseJSON
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getReloadTransactions = () => {
        const { info } = this.state
        var { username } = info
        const url = 'https://api.thecashguard.com/transactions/' + username
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
                    historicalReload: responseJSON
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    renderPending = ({ item }) => {
        if (item.transactionstatus =='pending'){
            return (
                    <TouchableOpacity key={item.transactionID} style={[{ borderRadius: 12, marginLeft: 15, margin: 5, height: 80, width: '90%', borderColor: '#dddddd', borderWidth: 1.0 }]}>
                        <View style={{  margin: 15 }}>
                            <View style={{ flexDirection:'row'}}>    
                            <Text style={{ fontSize: 14, fontWeight: 'bold',width:'90%' }}>
                                RM {item.amount}
                            </Text>
                            <FontAwesome containerStyle={{ alignSelf: 'flex-end', right: 0 }} name="arrow-circle-right" size={30 * 0.75} color='black' />
                            </View>
                            <Text style={{ fontSize: 11, fontWeight: '400' }}>
                                Status: {item.transactionstatus}
                            </Text>
                            <Text style={{ fontSize: 11, fontWeight: '400' }}>
                                ID: {item.ticker}
                            </Text>
                        </View>     
                    </TouchableOpacity>
            )}
        }
    renderHoldings = ({ item }) => {
        if (item.transactionstatus =='purchased'){
        return (
                <TouchableOpacity key={item.transactionID} style={[{ borderRadius: 12, marginLeft: 15, margin: 5, height: 80, width: '90%', borderColor: '#dddddd', borderWidth: 1.0 }]}>
                    <View style={{  margin: 15 }}>
                        <View style={{ flexDirection:'row'}}>    
                        <Text style={{ fontSize: 14, fontWeight: 'bold',width:'90%' }}>
                            RM {item.amount}
                        </Text>
                        <FontAwesome containerStyle={{ alignSelf: 'flex-end', right: 0 }} name="arrow-circle-right" size={30 * 0.75} color='black' />
                        </View>
                        <Text style={{ fontSize: 11, fontWeight: '400' }}>
                            Status: {item.transactionstatus}
                        </Text>
                        <Text style={{ fontSize: 11, fontWeight: '400' }}>
                            ID: {item.ticker}
                        </Text>
                    </View>     
                </TouchableOpacity>
        )}
    }
    renderHistory = ({ item }) => {
        return (
            <TouchableOpacity key={item.reload_id} style={[{ borderRadius: 12, marginLeft: 15, margin: 5, height: 80, width: '90%', borderColor: '#dddddd', borderWidth: 1.0 }]}>
                <View style={{  margin: 15 }}>
                    <View style={{ flexDirection:'row'}}>    
                    <Text style={{ fontSize: 14, fontWeight: 'bold',width:'90%' }}>
                        RM {item.amount}
                    </Text>
                    <FontAwesome containerStyle={{ alignSelf: 'flex-end', right: 0 }} name="arrow-circle-right" size={30 * 0.75} color='black' />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '400' }}>
                        Payment Method: {item.type}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '400' }}>
                        ID: {item.reload_id}
                    </Text>
                </View>
               
            </TouchableOpacity>
        )
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
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <G
                    key={index}>
                    <SvgText
                        x={x(index) + (bandwidth / 2)}
                        y={y(value) - 8}
                        fontSize={11}
                        fontWeight={'bold'}
                        fill={'rgba(255,255,255,0.9)'}
                        animate={true}
                        animationDuration={500}
                        alignmentBaseline={'middle'}
                        textAnchor={'middle'}
                    >
                        {'+' + value + '%'}
                    </SvgText>
                    <Rect
                        x={x(index)}
                        y={y(value) - 1} // Subtract Height / 2 to make half of the Rect above the bar
                        rx={5} // Set to Height / 2
                        ry={5} // Set to Height / 2
                        width={bandwidth}
                        height={5} // Height of the Rect
                        fill={'rgba(255,255,255,0.9)'}
                    />
                </G>
            ))
        )
        const BottomLabel = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <G key={index + 'bottom'}>
                    <SvgText
                        x={x(index) + (bandwidth / 2)}
                        y={130}
                        fontSize={11}
                        fontWeight={'bold'}
                        fill={'white'}
                        animate={true}
                        animationDuration={500}
                        alignmentBaseline={'middle'}
                        textAnchor={'middle'}
                    >
                        {'JAN'}
                    </SvgText>
                </G>
            ))
        )
        return (
            <SafeAreaView style={{ position: 'absolute', backgroundColor: 'white' }}>
                <View style={{ alignContent: 'flex-start', flexDirection: 'row', backgroundColor: 'white' }}>
                    <Text style={{ color: 'black', width: '80%', marginTop: 5, marginLeft: 10, fontWeight: "bold", fontSize: 30 }}>Portfolio</Text>
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
                <View style={{ backgroundColor: 'mediumseagreen', paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', alignContent: 'flex-end' }}>Performance</Text>
                    <BarChart
                        style={{ height: 150 }}
                        data={[120, 20, 34, 50, 70, 32, 25]}
                        animate={true}
                        animationDuration={500}
                        formatLabel={(value, index) => index}
                        gridMin={0}
                        spacingInner={0.1}
                        contentInset={{ top: 20, bottom: 30 }}
                        svg={{
                            strokeWidth: 2,
                            fill: 'rgba(255,255,255,0.9)',
                        }}
                    >
                        <Labels />
                        <BottomLabel />
                    </BarChart>
                </View>
                <ScrollableTabView tabBarActiveTextColor='black' tabBarUnderlineStyle={{ height: 1, backgroundColor: '#0EBE2C' }} style={{ borderWidth: 0, marginTop: 0, backgroundColor: 'rgba(0,0,0,0.01)', backgroundColor: '#fff' }}>
                    <ScrollView style={{ height: 600, shadowColor: '#ccc' }} tabLabel="Holdings" scrollEventThrottle={16} >
                    <View style={[{ paddingTop: 10, paddingLeft: 0, width: '100%', height: 1100, margin: 0, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
                            <Text style={{fontWeight:'bold',fontSize:16}}> Holdings </Text>
                            <FlatList
                                data={this.state.currentHolding}
                                renderItem={this.renderHoldings}
                                keyExtractor={(item, index) => item.reload_id}
                                snapToAlignment={'center'}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={Dimensions.get('window').width / 10}
                            />
                        </View>
                    </ScrollView>
                    <ScrollView style={{ height: 600, shadowColor: '#ccc' }} tabLabel="Pending">
                    <View style={[{ paddingTop: 10, paddingLeft: 0, width: '100%', height: 1100, margin: 0, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
                            <Text style={{fontWeight:'bold',fontSize:16}}> Purchase pending </Text>
                            <FlatList
                                data={this.state.currentHolding}
                                renderItem={this.renderPending}
                                keyExtractor={(item, index) => item.reload_id}
                                snapToAlignment={'center'}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={Dimensions.get('window').width / 10}
                            />
                        </View>
                    </ScrollView>
                    <ScrollView style={{ height: 600, shadowColor: '#ccc' }} tabLabel="History">
                    <View style={[{ paddingTop: 10, paddingLeft: 0, width: '100%', height: 1100, margin: 0, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
                            <Text style={{fontWeight:'bold',fontSize:16}}> Reload History</Text>
                            <FlatList
                                data={this.state.historicalReload}
                                renderItem={this.renderHistory}
                                keyExtractor={(item, index) => item.reload_id}
                                snapToAlignment={'center'}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={Dimensions.get('window').width / 10}
                            />
                        </View>
                    </ScrollView>
                </ScrollableTabView>
            </SafeAreaView>
        );
    }
}