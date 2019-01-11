/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  Image
 } from 'react-native';
import AuthLib from '../../libs/Auth';
import Css from '../../libs/Css';
import Config from '../../libs/Config';
import LoginView from './tmpl/login';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

var adUnitID = Config.androidAdRewardUnitID;
if(Platform.OS === "ios"){
  adUnitID = Config.iosAdrewardUnitID;
}

const Advert = firebase.admob().rewarded(adUnitID);
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

Advert.loadAd(request.build());
Advert.on('onAdLoaded', () => {
  console.log('Advert ready to show.');
});

Advert.on('onRewarded', (event) => {
  console.log('The user watched the entire video and will now be rewarded!', event);
});


var Auth = new AuthLib();

class profile extends Component {
  constructor(props){
    super(props);
  }

  static navigationOptions = {
    tabBarLabel: '',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-person' : 'ios-person-outline'} />
    ),
    headerTitle:'Profile',
    title:'Profile'
  };

  _calculateImageHeight(imageWidth,imageHeight){
    var width = 128;
    var height = 128;
    if(imageWidth<=128){
      width = imageWidth;
    }

    if(imageHeight <= 128){
      height = imageHeight;
    } else {
      height = imageWidth/width*imageHeight;
    }
    return {height:height,width:width,borderRadius:Math.floor(width/2)};
  }

  componentDidMount(){
  }

  _watchRewardAd(){
    console.log('Ad reward');
    if (Advert.isLoaded()) {
      Advert.show();
    } else {
      console.log('Ad reward skip');
    }
  }
  //
  render() {
    var self = this;
    const {navigate} = self.props.navigation;
    if(this.props.screenProps.user == null){
      return (
        <LoginView signOut={this.props.screenProps.signOut} signIn={this.props.screenProps.signIn}/>

      )
    } else {
      return (
          <ScrollView style={{backgroundColor:"#e8e8e8"}}>
            <View style={Css.profileContainer}>
              <View>
              {
                this.props.screenProps.user.profile_picture && this.props.screenProps.user.profile_picture.width && this.props.screenProps.user.profile_picture.height &&
                <Image source={{uri: this.props.screenProps.user.profile_picture.secure_url}}
           style={[this._calculateImageHeight(this.props.screenProps.user.profile_picture.width,this.props.screenProps.user.profile_picture.height), {marginTop:10}]} />
              }
              </View>

              <View style={Css.profileName}>
                <Text>{this.props.screenProps.user.username}</Text>
              </View>

            </View>
            <View style={Css.profileNavigatorContainer}>
              <TouchableOpacity  onPress={()=>navigate("UserDetailStack",{user_id:self.props.screenProps.user._id,username:self.props.screenProps.user.username})} style={[Css.profileButtonNavigator,Css.profileButtonNavigatorLastChild]} >
                <Text>Comments</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>

            </View>


            <View style={Css.profileNavigatorContainer}>
              <TouchableOpacity  onPress={()=>self.props.navigation.navigate("WebViewStack",{uri:"https://www.bumbuddy.app/privacy"})} style={Css.profileButtonNavigator} >
                <Text>Privacy Policy</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>self.props.navigation.navigate("WebViewStack",{uri:"https://www.bumbuddy.app/terms"})} style={Css.profileButtonNavigator} >
                <Text>Terms</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>self.props.navigation.navigate("WebViewStack",{uri:"https://www.bumbuddy.app/open-source-libraries"})} style={[Css.profileButtonNavigator,Css.profileButtonNavigatorLastChild]} >
                <Text>Open Sources Libraries</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
            </View>
            
            <View style={Css.profileNavigatorContainer}>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate("SettingsStack")} style={[Css.profileButtonNavigator]} >
                <Text>Settings</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>self.props.navigation.navigate("WebViewStack",{uri:"https://www.bumbuddy.app/feedback"})} style={[Css.profileButtonNavigator]} >
                <Text>Feedback</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{self._watchRewardAd()}} style={[Css.profileButtonNavigator, Css.profileButtonNavigatorLastChild]} >
                <Text>Support us (Ads)</Text>
                <Icon size={20} name="ios-arrow-forward" backgroundColor="#4267b2"/>
              </TouchableOpacity>
            </View>

            <View style={Css.profileNavigatorContainer}>
              <TouchableOpacity
                onPress={() => this.props.screenProps.signOut()}
                style={[Css.profileButtonNavigator,Css.profileButtonNavigatorLastChild]} >
                <Text>Sign Out</Text>
                <Icon size={20} name="ios-log-out" backgroundColor="#4267b2"/>
              </TouchableOpacity>
            </View>
          </ScrollView>
      )
    }
  }
}
module.exports = profile;
