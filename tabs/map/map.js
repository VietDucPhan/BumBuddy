import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
  Platform
 } from 'react-native';
import Bums from '../../libs/Bums';
import CacheLib from '../../libs/Cache';
import Callout from './tmpl/callout';
 import LoadingView from '../../commons/loading';
import Icon from 'react-native-vector-icons/Ionicons';
var ImagePicker = require('react-native-image-picker');
var { width, height } = Dimensions.get('window');
var BumsModel = new Bums();
var Cache = new CacheLib();

const ASPECT_RATIO = width / height;
var LATITUDE = 10.769261;
var LONGITUDE = 106.694670;
var LATITUDE_DELTA = 0.0022;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


class Map extends Component {

  constructor(props){
    super(props);
    this.state = {
      region:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      loadingVisible:false,
      mapViewHeight:300,
      bums:[]
    }
    this._locatorOnPress.bind(this);
    this.moveToThisRegion.bind(this);
    this.goToBumDetail.bind(this);
  }

  static navigationOptions = ({navigation}) => {
    console.log('Map.navigationOptions',navigation);
    return {tabBarLabel: '',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-search' : 'ios-search-outline'} />
    ),
    headerTitle:'Map',
    title:'Create Bums',
    headerRight:(
      <TouchableOpacity onPress={()=>navigation.state.params._onClickHeaderRight()} >
        <Icon style={{padding:10,marginTop:5}} size={22} name="md-add-circle"/>
      </TouchableOpacity>
    ),}
  };

  _getBums(){
    var self = this;
    // BumsModel.getBums(function(response){
    //   if(response != null){
    //     //console.log('maps._getBums',response);
    //     self.setState({
    //       bums:response
    //     });
    //   }
    // });
  }

  goToBumDetail(_id){
    this.props.navigation.navigate('BumDetail',{_id:_id});
  }

  _locatorOnPress(){
    var self = this;
    navigator.geolocation.getCurrentPosition (
      (position) => {
        //console.log("Lat: " + position.coords.latitude + "\nLon: " + position.coords.longitude);
        self.setState({region:{
          longitude:position.coords.longitude,
          latitude:position.coords.latitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        statusBarHeight:0

      });
      Cache.getUserSetting(function(result){
        var data = {
          coordinate:[position.coords.longitude, position.coords.latitude],
          radius:result.radius
        };
        self._loadBums(data);
        console.log("getUserSetting",result);

      });
      },
      function(error){console.log('map._locatorOnPress',error)}
    );
  }

  _loadBumsAtCurrentLocation(){
    var self = this;
    Cache.getUserSetting(function(result){
      var data = {
        coordinate:[self.state.region.longitude, self.state.region.latitude],
        radius:result.radius
      };
      self._loadBums(data);
      //console.log("getUserSetting",result);

    });
  }

  _loadBums(data){
    var self = this;
    self.setState({
      loadingVisible:true
    });
    BumsModel.getSurroundBum(data,function(result){
      if(result && result.errors){
        self.setState({
          loadingName:"error",
        });
      } else {
        self.setState({
          bums:result.data,
          loadingVisible:false
        });
      }
    });
  }

  _getCurrentPostion(callback){
    this._locatorOnPress();
    if(this.state && this.state.region){
      return callback(true,this.state.region);
    } else {
      return callback(false);
    }

  }

  _arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
  }

  onRegionChangeComplete(region){
    //console.log('map.componentWillMount',width);
    var self = this;
    //console.log("onRegionChangeComplete", region);
    LATITUDE_DELTA = region.latitudeDelta;
    //LONGITUDE_DELTA = region.longitudeDelta;
    self.setState({region:{
      longitude:region.longitude,
      latitude:region.latitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LATITUDE_DELTA*ASPECT_RATIO
    }});

  }

  moveToThisRegion(region){
    this.setState({region:{
      longitude:region.longitude,
      latitude:region.latitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }});
  }

  _onClickHeaderRight(){
    var self = this;
    console.log(self.props.screenProps.user);
    if(self.props.screenProps.user != null){
      self.props.navigation.navigate('SearchPage');
    } else {
      self.props.navigation.navigate('Profile');
    }
  }

  componentDidMount(){
    var self = this;
    this._locatorOnPress();
    //this._getBums();
    self.props.navigation.setParams({
      _onClickHeaderRight:self._onClickHeaderRight.bind(this)
    });

  }

  componentWillMount() {
    setTimeout(()=>this.setState({statusBarHeight: 1}),500);
  }
  //

  _closeBtn(){
    this.setState({
      loadingVisible:!this.state.loadingVisible
    });
  }

  _locateBtn(){
    var self = this;
    // if(Platform.OS === 'ios'){
      return(
        <TouchableOpacity onPress={()=>self._locatorOnPress()} style={styles.locatorOnPressIcon}>
          <Icon style={styles.iconOnLocator} name="ios-locate" size={27} />
        </TouchableOpacity>
      );
    // }
  }
  
  render() {
    var self = this;
    return(
      <View style={[styles.mapContainer,{paddingTop: this.state.statusBarHeight }]}>
        <MapView
          style={[styles.mapView]}
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsScale={true}
          showsCompass={false}
          showsPointsOfInterest={false}
          showsBuildings={false}
          region={this.state.region}
          initialRegion={this.state.region}
        >
        {self.state.bums.map(function(obj, i){
          //console.log(obj);
            return (
              <Callout navigation={self.props.navigation} goToBumDetail={()=>self.goToBumDetail(obj._id)} key={i} bum={obj} />
            );
          })}
        </MapView>
        {self._locateBtn()}
        <LoadingView close={self._closeBtn.bind(this)} name={self.state.loadingName} visible={self.state.loadingVisible}/>
          

          <TouchableOpacity onPress={()=>self._loadBumsAtCurrentLocation()} style={styles.refreshBums}>
            <Icon style={styles.iconRefresh} name="ios-refresh" size={35} />
          </TouchableOpacity>
      </View>

    );
  }
}
  const styles = StyleSheet.create({
    mapContainer:{
      flex:1,
      justifyContent: 'flex-end',
      alignItems: 'center',

    },
    refreshBums:{
      position:"absolute",
      top:60,
      right:12,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:'rgba(255,255,255,0.7)'
    },
    locatorOnPressIcon:{
      position:"absolute",
      top:15,
      right:12,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:'rgba(255,255,255,0.7)'
    },
    iconRefresh:{
      paddingRight:10,
      paddingLeft:10,
      paddingTop:2
    },
    iconOnLocator:{
      paddingRight:7,
      paddingLeft:7,
      paddingTop:5,
      paddingBottom:5
    },
    mapView:{
      flex:1,
      width:width,
      paddingTop:100
    },
    headerRight:{
      padding:5
    }
  });
module.exports = Map;
